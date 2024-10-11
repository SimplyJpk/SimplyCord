import React from 'react';

import { useState } from 'react'
import { useEffect } from 'react'

interface InputBarProps {
  onSubmit: (message: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

const InputBar: React.FC<InputBarProps> = ({
  onSubmit,
  inputRef,
}) => {
  const [input, setInput] = useState('')

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    onSubmit(input)

    const inputElement = (event.target as HTMLFormElement).elements.namedItem('message') as HTMLInputElement
    setInput('')
    inputElement.value = ''
  }

  return (
    <div className="bg-gray-5 text-white p-2 rounded-lg">
      <form onSubmit={handleSubmit} className="flex flex-row gap-2 w-full">
        <div className="flex-grow flex justify-center items-center">
          <img src="/src/assets/icons/ui/iconmonstr-plus-circle-lined-240.png"
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
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
          Send
        </button>
      </form>
    </div>
  )
}

export default InputBar