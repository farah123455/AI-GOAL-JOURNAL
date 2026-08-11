import { useState, useRef, useEffect } from 'react';
import Card from './Card';
import Button from './Button';

export default function VoiceRecorder() {
  const [recordingState, setRecordingState] = useState('idle'); // idle | recording | recorded | error
  const [errorMessage, setErrorMessage] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  // Check browser API support on mount
  const isSupported = typeof window !== 'undefined' &&
    navigator?.mediaDevices?.getUserMedia &&
    typeof window.MediaRecorder !== 'undefined';

  // Cleanup media stream and object URL on unmount
  useEffect(() => {
    return () => {
      stopTracks();
      clearTimer();
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  function stopTracks() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }

  function clearTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  async function startRecording() {
    if (!isSupported) {
      setErrorMessage('Audio recording is not supported in this browser.');
      setRecordingState('error');
      return;
    }

    setErrorMessage('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setRecordingState('recorded');
        stopTracks();
      };

      mediaRecorder.start();
      setRecordingState('recording');
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone access error:', err);
      stopTracks();
      clearTimer();
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage('Microphone access was denied. Please allow microphone permissions to record.');
      } else {
        setErrorMessage('Could not access microphone: ' + err.message);
      }
      setRecordingState('error');
    }
  }

  function stopRecording() {
    clearTimer();
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  }

  function discardRecording() {
    clearTimer();
    stopTracks();
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setAudioBlob(null);
    setRecordingTime(0);
    setRecordingState('idle');
    setErrorMessage('');
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  if (!isSupported) {
    return (
      <Card className="mb-6 border-amber-200 bg-amber-50">
        <h3 className="font-semibold text-ink">Voice Journal (Prototype)</h3>
        <p className="mt-2 text-sm text-ink/70">
          Audio recording is not supported by your current browser.
        </p>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-ink">Voice Journal (Prototype)</h3>
          <p className="text-sm text-ink/60">
            Record a voice entry using your microphone.
          </p>
        </div>

        {recordingState === 'recording' && (
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 animate-ping rounded-full bg-ember" />
            <span className="font-mono text-sm font-semibold text-ember">
              {formatTime(recordingTime)}
            </span>
          </div>
        )}
      </div>

      {errorMessage && (
        <div role="alert" className="mb-4 rounded-card bg-red-50 p-3 text-sm text-ember">
          {errorMessage}
        </div>
      )}

      {/* Recording controls */}
      <div className="flex flex-wrap items-center gap-3">
        {recordingState === 'idle' || recordingState === 'error' ? (
          <Button onClick={startRecording}>
            🎙️ Start Recording
          </Button>
        ) : null}

        {recordingState === 'recording' ? (
          <Button variant="secondary" onClick={stopRecording} className="bg-ember text-white hover:bg-ember/90 border-transparent">
            ⏹️ Stop Recording
          </Button>
        ) : null}

        {recordingState === 'recorded' && audioUrl ? (
          <div className="flex flex-col w-full gap-3">
            <audio controls src={audioUrl} className="w-full rounded-card border border-line" />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={discardRecording}>
                🗑️ Discard Recording
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
