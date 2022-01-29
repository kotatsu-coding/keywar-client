import { createContext, useContext, useRef } from 'react'
import { EAudio } from '../types'

interface IAudioProviderProps {
  children: React.ReactNode
}



interface IAudioContext {
  playAudio?: (audioType: EAudio) => void
}

const AudioContext = createContext<IAudioContext>({})

const AudioProvider = ({
  children
}: IAudioProviderProps) => {
  const audioSuccessRef = useRef<HTMLAudioElement | null>(null)
  const audioFailureRef = useRef<HTMLAudioElement | null>(null)

  const playAudio = (audioType: EAudio) => {
    let clonedAudio
    switch (audioType) {
      case EAudio.SUCCESS:
        clonedAudio = audioSuccessRef.current?.cloneNode(true) as HTMLAudioElement
        break
      case EAudio.FAILURE:
      default:
        clonedAudio = audioFailureRef.current?.cloneNode(true) as HTMLAudioElement
    }
    clonedAudio.play()
  }

  return (
    <AudioContext.Provider
      value={{
        playAudio: playAudio
      }}
    >
      { children }
      <audio src="/sound_success.mp3" ref={audioSuccessRef}></audio>
      <audio src='/sound_fail.mp3' ref={audioFailureRef}></audio>
    </AudioContext.Provider>
  )
}

const useAudio = () => {
  const audioContext = useContext(AudioContext)
  return audioContext.playAudio ?? (() => {})
}


export { AudioProvider, useAudio as default }