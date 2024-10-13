import React, { useState, useEffect } from 'react';
// Resources
import PlusCircle from '../assets/icons/ui/iconmonstr-plus-circle-lined-240.png'
// Validation
import { messageSchema } from "../../../server/src/shared/validation/message";

interface InputBarProps {
  onSubmit: (message: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  disabled: boolean;
}

const InputBar: React.FC<InputBarProps> = ({
  onSubmit,
  inputRef,
  disabled,
}) => {
  const [input, setInput] = useState('')
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value)
    // messageSchema is yup
    const isValid = messageSchema.isValidSync({ message: event.target.value });
    setIsValid(isValid);
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    onSubmit(input)
    setIsValid(false);

    const inputElement = (event.target as HTMLFormElement).elements.namedItem('message') as HTMLInputElement
    setInput('')
    inputElement.value = ''
  }

  return (
    <div className="bg-gray-5 text-white p-2 rounded-lg">
      <form onSubmit={handleSubmit} className="flex flex-row gap-2 w-full">
        <div className="flex-grow flex justify-center items-center">
          <img src={PlusCircle}
            alt="plus-circle-lined"
            className="w-10 h-10 rounded-full bg-gray-5 align-middle cursor-pointer hover:bg-gray-6"
          />
        </div>
        <input
          ref={inputRef}
          type="text"
          name="message"
          value={input}
          onChange={handleInputChange}
          className="rounded-lg text-white bg-gray-800 p-2 w-full"
          placeholder="Type your message here..."
          disabled={disabled}
          autoComplete="off"
          autoCorrect="off"
        />
        <button
          type="submit"
          // color red if invalid
          className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg bg-blue-500 disabled:bg-gray-500"
          disabled={disabled || !isValid}
        >
          Send
        </button>
      </form>
    </div>
  )
}

export default InputBar