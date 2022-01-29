import { createContext, useContext, useRef } from 'react'

interface IAudioProviderProps {
  children: React.ReactNode
}

type TAudioType = 'success' | 'failure'

interface IAudioContext {
  playAudio?: (audioType: TAudioType) => void
}

const AudioContext = createContext<IAudioContext>({})

const AudioProvider = ({
  children
}: IAudioProviderProps) => {
  const audioSuccessRef = useRef<HTMLAudioElement | null>(null)
  const audioFailureRef = useRef<HTMLAudioElement | null>(null)

  const playAudio = (audioType: TAudioType) => {
    let clonedAudio
    switch (audioType) {
      case 'success':
        clonedAudio = audioSuccessRef.current?.cloneNode(true) as HTMLAudioElement
        break
      case 'failure':
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