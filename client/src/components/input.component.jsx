import {useState} from "react";

const InputBox = ({id, type, value, placeholder, name, icon}) => {
    const [passwordVisibility, setPasswordVisibility] = useState(false);

    return (
        <div className="relative w-[100%] mb-4">
            <input
                id={id}
                name={name}
                defaultValue={value}
                placeholder={placeholder}
                type={type === "password" ? passwordVisibility ? "text" : "password" : type}
                className="input-box"
            />
            <i className={"fi " + icon + " input-icon"}></i>

            {
                type === "password" ?
                    <i className={"fi fi-rr-eye" + (!passwordVisibility ? "-crossed" : "")  + " input-icon left-[auto] right-4 cursor-pointer"}
                    onClick={() => setPasswordVisibility(currentVal => !currentVal)}></i> : ""
            }
        </div>
    )
}

export default InputBox;