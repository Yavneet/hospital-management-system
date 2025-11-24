import React, { useState, useRef } from "react";

export default function EmergencyButton() {
  const [active, setActive] = useState(false);
  const [message, setMessage] = useState("");
  const audioCtxRef = useRef(null);

  // Play an emergency beep sound, reusing AudioContext when possible.
  const playAlertSound = async () => {
    try {
      if (typeof window === "undefined") return; // guard server-side

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return; // browser does not support WebAudio

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }

      const audioCtx = audioCtxRef.current;

      // Some browsers require a user gesture to resume audio context
      if (audioCtx.state === "suspended") {
        try {
          await audioCtx.resume();
        } catch (e) {
          // resume may fail silently in some browsers; continue
        }
      }

      const oscillator = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      oscillator.type = "square";
      oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime); // 1000 Hz beep
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime); // lower volume
      oscillator.connect(gain);
      gain.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 1); // play for 1 second
    } catch (err) {
      // don't break the UI if audio fails
      console.warn("Audio alert failed:", err);
    }
  };

  const handleEmergency = async () => {
    setActive(true);
    setMessage("🚨 Emergency Alert Sent to All Doctors!");
    await playAlertSound();

    // Stop blinking after 5 seconds
    setTimeout(() => {
      setActive(false);
      setMessage("✅ Alert handled successfully.");
    }, 5000);
  };

  return (
    <div className="container text-center mt-5">
      <h2 className="text-danger mb-3">🚨 Emergency Control Center</h2>
      <p className="text-muted">
        Press the button below to alert all doctors in case of emergency.
      </p>

      <button
        onClick={handleEmergency}
        aria-pressed={active}
        aria-live="polite"
        className={`btn btn-lg fw-bold px-5 py-3 ${
          active ? "btn-danger blinking" : "btn-outline-danger"
        }`}
        disabled={active}
      >
        {active ? "🚨 ALERT ACTIVE" : "Trigger Emergency"}
      </button>

      {message && (
        <h4 className="mt-4 text-danger" role="status">
          {message}
        </h4>
      )}
    </div>
  );
}
