import React from 'react';

import { useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'

interface InputBarProps {
  onSubmit: (message: string) => void;
}

const InputBar: React.FC<InputBarProps> = ({
  onSubmit,
}) => {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

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
    <div className="bg-gray-500 text-white p-2 rounded-lg">
      <form onSubmit={handleSubmit} className="flex flex-row gap-2 w-full">
        <input
          ref={inputRef}
          type="text"
          name="message"
          value={input}
          onChange={handleInputChange}
          className="rounded-lg text-white bg-gray-800 p-2 w-full"
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