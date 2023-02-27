import { useState } from "react";

const useInput = (validation) => {
  const [input, setInput] = useState("");
  const [inputTouched, setInputTouced] = useState("");

  const isValid = validation(input);
  const error = !isValid && inputTouched;

  const valueChangeHandler = (event) => {
    setInput(event.target.value);
  };

  const inputBlurHandler = (event) => {
    setInputTouced(true);
  };

  const reset = () => {
    setInput('');
    setInputTouced(false);
  } 

  return {
    value: input,
    isValid,
    error,
    valueChangeHandler,
    inputBlurHandler,
    reset
  }
};

export default useInput;
