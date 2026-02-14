import { useEffect, useRef, useState } from 'react';
import { useWebRTC } from '../utils/useWebRTC';
import socket from '../utils/socket';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { cn } from '../utils/cn';


function VideoChat() {
  const videoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const streamRef = useRef(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callStatus, setCallStatus] = useState('connecting'); // connecting | ringing | connected | error
  const [targetUser, setTargetUser] = useState(null);
  const [mediaError, setMediaError] = useState(null);
  const { targetUserId } = useParams();
  const { _id } = useSelector((state) => state.user);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const {
    peerRef,
    handleUserJoined,
    setLocalStream,
    incomingCall: hookIncomingCall,
    callAnswered: hookCallAnswered,
    handleIceCandidate,
  } = useWebRTC(socket, _id, setRemoteStream);

  // Fetch target user info
  useEffect(() => {
    const fetchTargetUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user/connections`, {
          withCredentials: true,
        });
        const foundUser = res.data.data.find((u) => u._id === targetUserId);
        if (foundUser) setTargetUser(foundUser);
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };
    fetchTargetUser();
  }, [targetUserId]);

  // Track connection status
  useEffect(() => {
    if (remoteStream) {
      setCallStatus('connected');
    }
  }, [remoteStream]);

  // Socket listeners
  useEffect(() => {
    if (!_id || !targetUserId) return;

    const wrappedIncomingCall = (data) => {
      setCallStatus('ringing');
      hookIncomingCall(data);
    };

    const wrappedCallAnswered = (data) => {
      hookCallAnswered(data);
    };

    const wrappedUserJoined = (data) => {
      setCallStatus('ringing');
      handleUserJoined(data);
    };

    socket.on('joined-user', wrappedUserJoined);
    socket.on('incoming-call', wrappedIncomingCall);
    socket.on('call-answered', wrappedCallAnswered);
    socket.on('ice-candidate', handleIceCandidate);

    return () => {
      socket.off('joined-user', wrappedUserJoined);
      socket.off('incoming-call', wrappedIncomingCall);
      socket.off('call-answered', wrappedCallAnswered);
      socket.off('ice-candidate', handleIceCandidate);
    };
  }, [_id, targetUserId]);

  // Get local media, then join
  useEffect(() => {
    if (!_id || !targetUserId) return;

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current = stream;
        setLocalStream(stream);
        if (videoRef.current) videoRef.current.srcObject = stream;
        socket.emit('joinChat', { _id, targetUserId });
      } catch (err) {
        console.error('Failed to access camera/microphone:', err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setMediaError('Camera/microphone permission denied. Please allow access and try again.');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setMediaError('No camera or microphone found on this device.');
        } else {
          setMediaError('Unable to access camera/microphone. Please check your device settings.');
        }
        setCallStatus('error');
      }
    };

    start();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (videoRef.current) videoRef.current.srcObject = null;
      if (peerRef.current) {
        peerRef.current.close();
        peerRef.current = null;
      }
    };
  }, [_id, targetUserId]);

  // Attach remote stream
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Controls
  const toggleMute = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const endCall = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (peerRef?.current) {
      peerRef.current.close();
      peerRef.current = null;
    }
    socket.emit('call-ended', { to: targetUserId });
    navigate(-1);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-black/20 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-rose-500/50">
                <img
                  src={targetUser?.photoUrl || '/placeholder.svg'}
                  alt={targetUser?.firstName || 'User'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className={cn(
                  'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900',
                  callStatus === 'connected' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
                )}
              />
            </div>
            <div>
              <h2 className="text-white font-semibold text-sm">
                {targetUser?.firstName} {targetUser?.lastName}
              </h2>
              <p
                className={cn(
                  'text-xs',
                  callStatus === 'connected' ? 'text-emerald-400' : 'text-amber-400'
                )}
              >
                {callStatus === 'connecting' && 'Connecting...'}
                {callStatus === 'ringing' && 'Ringing...'}
                {callStatus === 'connected' && 'Connected'}
              </p>
            </div>
          </div>
        </div>

        {/* Call duration placeholder */}
        {callStatus === 'connected' && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-xs font-medium">Live</span>
          </div>
        )}
      </div>

      {/* Video Area */}
      <div className="flex-1 relative flex items-center justify-center p-4 gap-4">
        {/* Remote Video (Large) */}
        <div className="relative flex-1 h-full max-h-[calc(100vh-200px)] rounded-2xl overflow-hidden bg-slate-800/80 border border-white/5 shadow-2xl">
          {mediaError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
              <div className="w-16 h-16 rounded-full bg-red-500/15 flex items-center justify-center">
                <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-red-400 font-medium">Media Access Error</p>
                <p className="text-white/50 text-sm mt-1 max-w-xs">{mediaError}</p>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="mt-2 px-4 py-2 rounded-lg bg-white/10 text-white/80 hover:bg-white/15 text-sm transition-all"
              >
                Go Back
              </button>
            </div>
          ) : remoteStream ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              {/* Avatar placeholder while waiting */}
              <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-rose-500/20 animate-pulse-glow">
                <img
                  src={targetUser?.photoUrl || '/placeholder.svg'}
                  alt={targetUser?.firstName || 'User'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <p className="text-white/80 font-medium">
                  {targetUser?.firstName} {targetUser?.lastName}
                </p>
                <p className="text-white/40 text-sm mt-1">
                  {callStatus === 'connecting' && 'Waiting to connect...'}
                  {callStatus === 'ringing' && 'Setting up video...'}
                </p>
              </div>
              {/* Animated rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-32 h-32 rounded-full border border-rose-500/10 animate-ping" style={{ animationDuration: '3s' }} />
                <div className="absolute w-48 h-48 rounded-full border border-rose-500/5 animate-ping" style={{ animationDuration: '4s' }} />
              </div>
            </div>
          )}

          {/* Remote user label */}
          {remoteStream && (
            <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm">
              <div className="w-5 h-5 rounded-full overflow-hidden">
                <img
                  src={targetUser?.photoUrl || '/placeholder.svg'}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-white text-xs font-medium">
                {targetUser?.firstName}
              </span>
            </div>
          )}
        </div>

        {/* Local Video (Picture-in-Picture) */}
        <div className="absolute bottom-6 right-6 w-44 h-32 md:w-56 md:h-40 rounded-xl overflow-hidden shadow-2xl border-2 border-white/10 hover:border-rose-500/40 transition-all duration-300 hover:scale-105 z-10 group">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className={cn(
              'w-full h-full object-cover',
              isVideoOff && 'hidden'
            )}
          />
          {isVideoOff && (
            <div className="w-full h-full bg-slate-700 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/20">
                <img
                  src={user?.photoUrl || '/placeholder.svg'}
                  alt="You"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
          {/* Your label */}
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-[10px] font-medium">You</span>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-center gap-4 px-6 py-5 bg-black/30 backdrop-blur-md border-t border-white/5">
        {/* Mute */}
        <button
          onClick={toggleMute}
          className={cn(
            'p-4 rounded-full transition-all duration-200 hover:scale-110 active:scale-95',
            isMuted
              ? 'bg-white/20 text-white ring-2 ring-white/20'
              : 'bg-white/10 text-white/80 hover:bg-white/15'
          )}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
        </button>

        {/* Video Toggle */}
        <button
          onClick={toggleVideo}
          className={cn(
            'p-4 rounded-full transition-all duration-200 hover:scale-110 active:scale-95',
            isVideoOff
              ? 'bg-white/20 text-white ring-2 ring-white/20'
              : 'bg-white/10 text-white/80 hover:bg-white/15'
          )}
          title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
        >
          {isVideoOff ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>

        {/* End Call */}
        <button
          onClick={endCall}
          className="p-4 rounded-full bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30 transition-all duration-200 hover:scale-110 hover:shadow-red-500/50 active:scale-95"
          title="End call"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default VideoChat;