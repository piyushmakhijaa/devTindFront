function Input({type, placeholder, value, onChange, className="", ...props}){
    return(
        <input value={value} type={type} placeholder={placeholder} onChange={onChange} {...props} />
    )
}

export default Input;