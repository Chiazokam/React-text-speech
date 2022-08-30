import React from 'react';
import { useTextToSpeech } from 'react-text-speech'

function App() {
  return (
    <div className='flex w-80 mt-24 mx-auto border-solid border-2 border-gray rounded-md p-4'>
      <div className=''>
        <span>Select a voice, type a message below then click `Speak` to hear the text being read</span>
      </div>

      {/* <div className='border-solid border-1 border-grey rounded'>

      </div> */}
    </div>
  );
}

export default App;
