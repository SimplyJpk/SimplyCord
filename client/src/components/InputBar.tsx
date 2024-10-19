import React, { useState, useEffect } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// MUI 
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
// MUI Components
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
// Validation
import * as yup from 'yup';

// FIXME: (James) Why no shared/validation import work
const messageSchema = yup.object().shape({
  message: yup.string().max(200).min(2).required(),
});

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.grey[900],
    color: 'white',
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
  },
  form: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(2),
    width: '100%',
  },
  iconButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textField: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey[800],
    borderRadius: theme.shape.borderRadius,
    '& .MuiOutlinedInput-root': {
      color: 'white',
    },
  },
  charCount: {
    color: theme.palette.grey[400],
    fontSize: '0.75rem',
    padding: theme.spacing(0),
  },
  submitButton: {
    fontWeight: 'bold',
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.primary.main,
    '&:disabled': {
      backgroundColor: theme.palette.grey[500],
    },
  },
}));

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
  const classes = useStyles();

  const [input, setInput] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isShiftHeld, setIsShiftHeld] = useState(false);

  // TODO: (James) Move to config/state, something more flexible
  const maxLength = 200;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (event.target.value.endsWith('\n') && !isShiftHeld) {
      if (isValid) {
        onSubmit(input);
        setInput('');
      }
      return;
    }

    setInput(event.target.value);
    const isStillValid = messageSchema.isValidSync({ message: event.target.value });
    setIsValid(isStillValid);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const inputElement = (event.target as HTMLFormElement).elements.namedItem('message') as HTMLTextAreaElement;

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

    onSubmit(input);
    setIsValid(false);
    setInput('');
    inputElement.value = '';
  };

  return (
    <Box className={classes.root}>
      <form
        onSubmit={handleSubmit}
        className={classes.form}
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
        <Box className={classes.iconButton}>
          <IconButton>
            <AddCircleOutlineIcon sx={{ fontSize: 40, color: 'grey.500', '&:hover': { color: 'grey.600' } }} />
          </IconButton>
        </Box>
        <Box sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <TextField
            inputRef={inputRef}
            name="message"
            value={input}
            onChange={handleInputChange}
            variant="outlined"
            multiline
            maxRows={3}
            placeholder="Type your message here..."
            disabled={disabled}
            autoComplete="off"
            autoCorrect="off"
            slotProps={{
              htmlInput: {
                maxLength,
                minLength: 1
              }
            }}
            className={classes.textField}
          />
          <Box className={classes.charCount}>
            {maxLength - input.length} characters left
          </Box>
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={disabled || !isValid}
          className={classes.submitButton}
        >
          Send
        </Button>
      </form>
    </Box>
  );
};

export default InputBar;