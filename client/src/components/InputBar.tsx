import React, { useState, useEffect } from 'react';
// Resources
import PlusCircle from '../assets/icons/ui/iconmonstr-plus-circle-lined-240.png'
// Validation
import * as yup from 'yup';

// FIXME: (James) Why no shared/validation import work
const messageSchema = yup.object().shape({
  message: yup.string().max(200).min(2).required(),
});

interface InputBarProps {
  onSubmit: (message: string) => void;
  inputRef: React.RefObject<HTMLTextAreaElement>;
  disabled: boolean;
}

const InputBar: React.FC<InputBarProps> = ({
  onSubmit,
  inputRef,
  disabled,
}) => {
  const [input, setInput] = useState('')
  const [isValid, setIsValid] = useState(false);

  const [isShiftHeld, setIsShiftHeld] = useState(false);

  // TODO: (James) Move to config/state, something more flexible
  const maxLength = 200;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (event.target.value.endsWith('\n') && !isShiftHeld) {
      if (isValid) {
        onSubmit(input);
        setInput('');
      }
      return;
    }

    setInput(event.target.value);
    // messageSchema is yup
    const isStillValid = messageSchema.isValidSync({ message: event.target.value });
    setIsValid(isStillValid);
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const inputElement = (event.target as HTMLFormElement).elements.namedItem('message') as HTMLTextAreaElement

    // strip off all newlines from end of input
    const inputWithoutNewlines = input.replace(/\n+$/, '');
    if (inputWithoutNewlines.length === 0) {
      return;
    }
    const isStillValid = messageSchema.isValidSync({ message: inputWithoutNewlines });
    if (!isStillValid) {
      inputElement.value = inputWithoutNewlines;
      setInput(inputWithoutNewlines);
      setIsValid(false);
      return;
    }

    onSubmit(input)
    setIsValid(false);

    setInput('')
    inputElement.value = ''
  }

  return (
    <div className="bg-gray-5 text-white p-2 rounded-lg">
      <form
        onSubmit={handleSubmit}
        className="flex flex-row gap-2 w-full"
        onKeyDown={(event) => {
          if (event.key === 'Shift') {
            setIsShiftHeld(true);
          }
        }}
        onKeyUp={(event) => {
          if (event.key === 'Shift') {
            setIsShiftHeld(false);
          }
        }}
      >
        <div className="flex-grow flex justify-center items-center">
          <img src={PlusCircle}
            alt="plus-circle-lined"
            className="w-10 h-10 rounded-full bg-gray-5 align-middle cursor-pointer hover:bg-gray-6"
          />
        </div>
        <textarea
          ref={inputRef}
          name="message"
          value={input}
          onChange={handleInputChange}
          className="rounded-lg text-white bg-gray-800 p-2 w-full resize-none h-7"
          placeholder="Type your message here..."
          disabled={disabled}
          autoComplete="off"
          autoCorrect="off"
          maxLength={maxLength}
          minLength={1}
        />
        <div className="absolute bottom-0 right-0 text-gray-400 text-xs p-1">
          {maxLength - input.length} characters left
        </div>
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