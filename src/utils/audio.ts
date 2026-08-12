/** 
 * Web Audio API Synth Engine for Wishora Celebration Tracks 
 * Generates ambient background melodies cleanly without relying on external media files. 
 */ 
class MusicSynthEngine { 
  private ctx: AudioContext | null = null; 
  private isPlaying: boolean = false; 
  private currentTrack: string | null = null; 
  private timerId: number | null = null; 

  private initCtx() { 
    if (!this.ctx) { 
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext; 
      this.ctx = new AudioCtx(); 
    } 
    if (this.ctx.state === 'suspended') { 
      this.ctx.resume(); 
    } 
  } 

  public playTrack(trackId: string) { 
    this.stop(); 
    this.initCtx(); 
    if (!this.ctx) return; 
    
    this.isPlaying = true; 
    this.currentTrack = trackId; 
    
    let notes: number[] = []; 
    let tempo = 300; 

    if (trackId === 'birthday') { 
      notes = [ 261.63, 261.63, 293.66, 261.63, 349.23, 329.63, 261.63, 261.63, 293.66, 261.63, 392.00, 349.23, 261.63, 261.63, 523.25, 440.00, 349.23, 329.63, 293.66, 466.16, 466.16, 440.00, 349.23, 392.00, 349.23 ]; 
      tempo = 380; 
    } else if (trackId === 'romantic') { 
      notes = [ 220, 277.18, 329.63, 440, 329.63, 277.18, 196, 246.94, 293.66, 392, 293.66, 246.94, 174.61, 220, 261.63, 349.23, 261.63, 220, 164.81, 207.65, 246.94, 329.63, 246.94, 207.65 ]; 
      tempo = 320; 
    } else if (trackId === 'upbeat') { 
      notes = [ 329.63, 392.00, 523.25, 659.25, 523.25, 392.00, 349.23, 440.00, 523.25, 698.46, 523.25, 440.00, 293.66, 349.23, 440.00, 587.33, 440.00, 349.23, 392.00, 493.88, 587.33, 783.99, 587.33, 493.88 ]; 
      tempo = 220; 
    } else { 
      notes = [ 261.63, 329.63, 392.00, 493.88, 392.00, 329.63, 220.00, 261.63, 329.63, 392.00, 329.63, 261.63 ]; 
      tempo = 450; 
    } 

    let index = 0; 
    const playNextNote = () => { 
      if (!this.isPlaying || !this.ctx) return; 
      
      const freq = notes[index % notes.length]; 
      const osc = this.ctx.createOscillator(); 
      const gain = this.ctx.createGain(); 
      
      osc.type = trackId === 'romantic' ? 'sine' : trackId === 'birthday' ? 'triangle' : 'sine'; 
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime); 
      
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime); 
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (tempo / 1000) * 1.5); 
      
      osc.connect(gain); 
      gain.connect(this.ctx.destination); 
      
      osc.start(); 
      osc.stop(this.ctx.currentTime + (tempo / 1000) * 1.5); 
      
      index++; 
      this.timerId = window.setTimeout(playNextNote, tempo); 
    }; 
    playNextNote(); 
  } 

  public stop() { 
    this.isPlaying = false; 
    this.currentTrack = null; 
    if (this.timerId !== null) { 
      clearTimeout(this.timerId); 
      this.timerId = null; 
    } 
  } 

  public getIsPlaying(): boolean { 
    return this.isPlaying; 
  } 

  public getCurrentTrack(): string | null { 
    return this.currentTrack; 
  }
} 

export const musicSynth = new MusicSynthEngine();
