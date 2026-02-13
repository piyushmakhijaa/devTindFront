import { useRef, useCallback } from "react";

export const useWebRTC = (socket, fromUserId, setRemoteStream) => {
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteUserIdRef = useRef(null);

  // Base peer creation — does NOT set onnegotiationneeded
  const createPeer = useCallback(() => {
    if (peerRef.current) {
      peerRef.current.close();
    }

    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
          ],
        },
      ],
    });

    // ICE candidate exchange
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Sending ICE candidate to:", remoteUserIdRef.current);
        socket.emit("ice-candidate", {
          to: remoteUserIdRef.current,
          candidate: event.candidate,
        });
      }
    };

    // Remote track received
    peer.addEventListener("track", (event) => {
      console.log("Remote track received");
      const remoteStream = event.streams[0];
      if (setRemoteStream) {
        setRemoteStream(remoteStream);
      }
    });

    peerRef.current = peer;
    return peer;
  }, [socket, fromUserId, setRemoteStream]);

  const setLocalStream = (stream) => {
    localStreamRef.current = stream;
  };

  // ---- CALLER SIDE ----
  // When the remote user joins, create a peer WITH negotiation enabled,
  // then add tracks → onnegotiationneeded fires → offer is created & sent
  const handleUserJoined = ({ _id }) => {
    console.log("Remote user joined:", _id);
    remoteUserIdRef.current = _id;
    const peer = createPeer();

    // Only the CALLER gets negotiation — this is the key fix
    peer.onnegotiationneeded = async () => {
      try {
        console.log("Negotiation needed — creating offer");
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        socket.emit("call-user", {
          _id: remoteUserIdRef.current,
          fromUserId,
          offer: peer.localDescription,
        });
        console.log("Offer sent to:", remoteUserIdRef.current);
      } catch (err) {
        console.error("Error during negotiation:", err);
      }
    };

    // Adding tracks triggers onnegotiationneeded
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        peer.addTrack(track, localStreamRef.current);
      });
    }
  };

  // ---- CALLEE SIDE ----
  // Receives the offer, creates peer WITHOUT negotiation,
  // adds tracks, sets remote desc, creates answer, sends it back
  const incomingCall = async ({ fromUserId: callerUserId, offer }) => {
    console.log("Incoming call from:", callerUserId);
    remoteUserIdRef.current = callerUserId;

    const peer = createPeer();
    // NO onnegotiationneeded here — callee must NOT send an offer

    // Add local tracks BEFORE setting remote description
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        peer.addTrack(track, localStreamRef.current);
      });
    }

    await peer.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    socket.emit("answer-call", {
      to: callerUserId,
      answer: peer.localDescription,
    });
    console.log("Sent answer to:", callerUserId);
  };

  // Called when the caller receives the answer
  const callAnswered = async ({ answer }) => {
    if (!peerRef.current) return;
    await peerRef.current.setRemoteDescription(
      new RTCSessionDescription(answer)
    );
    console.log("Call answered — connection established");
  };

  // Handle incoming ICE candidates from the remote user
  const handleIceCandidate = async ({ candidate }) => {
    if (peerRef.current && candidate) {
      try {
        await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        console.log("Added remote ICE candidate");
      } catch (err) {
        console.error("Error adding ICE candidate:", err);
      }
    }
  };

  return {
    peerRef,
    handleUserJoined,
    incomingCall,
    callAnswered,
    setLocalStream,
    handleIceCandidate,
  };
};
