import { useState } from 'react';

interface AbletonLiveProps {
  onClose: () => void;
}

interface Track {
  id: string;
  name: string;
  type: 'audio' | 'midi';
  color: string;
  clips: Clip[];
  volume: number;
  pan: number;
  muted: boolean;
  solo: boolean;
}

interface Clip {
  id: string;
  name: string;
  scene: number;
  playing: boolean;
}

const mockTracks: Track[] = [
  { id: '1', name: 'Drums', type: 'midi', color: '#f59e0b', clips: [{ id: 'c1', name: 'Beat 1', scene: 0, playing: true }, { id: 'c2', name: 'Beat 2', scene: 1, playing: false }], volume: 0, pan: 0, muted: false, solo: false },
  { id: '2', name: 'Bass', type: 'midi', color: '#3b82f6', clips: [{ id: 'c3', name: 'Bass Line', scene: 0, playing: true }], volume: -3, pan: 0, muted: false, solo: false },
  { id: '3', name: 'Synth', type: 'midi', color: '#a855f7', clips: [{ id: 'c4', name: 'Pad', scene: 0, playing: false }, { id: 'c5', name: 'Lead', scene: 1, playing: false }], volume: -6, pan: 0, muted: false, solo: false },
  { id: '4', name: 'Vocals', type: 'audio', color: '#22c55e', clips: [{ id: 'c6', name: 'Verse', scene: 1, playing: false }], volume: 0, pan: 0, muted: true, solo: false },
];

const AbletonLive: React.FC<AbletonLiveProps> = ({ onClose: _onClose }) => {
  const [tracks, setTracks] = useState(mockTracks);
  const [view, setView] = useState<'session' | 'arrangement'>('session');
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);

  const toggleTrackMute = (id: string) => {
    setTracks(prev => prev.map(t => t.id === id ? { ...t, muted: !t.muted } : t));
  };

  const toggleTrackSolo = (id: string) => {
    setTracks(prev => prev.map(t => t.id === id ? { ...t, solo: !t.solo } : t));
  };

  const toggleClip = (trackId: string, clipId: string) => {
    setTracks(prev => prev.map(t => {
      if (t.id === trackId) {
        return { ...t, clips: t.clips.map(c => ({ ...c, playing: c.id === clipId ? !c.playing : false })) };
      }
      return t;
    }));
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] text-white text-sm">
      {/* Header */}
      <div className="h-10 bg-[#2a2a2a] flex items-center justify-between px-4 border-b border-black">
        <div className="flex items-center gap-4">
          <span className="font-bold text-[#ff764d]">Live</span>
          <div className="flex gap-1">
            <button
              onClick={() => setView('session')}
              className={`px-3 py-1 rounded text-xs ${view === 'session' ? 'bg-[#ff764d]' : 'bg-white/10'}`}
            >
              Session
            </button>
            <button
              onClick={() => setView('arrangement')}
              className={`px-3 py-1 rounded text-xs ${view === 'arrangement' ? 'bg-[#ff764d]' : 'bg-white/10'}`}
            >
              Arrangement
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`w-8 h-8 rounded flex items-center justify-center ${isPlaying ? 'bg-green-600' : 'bg-white/20'}`}
            >
              {isPlaying ? '⏹' : '▶'}
            </button>
            <button className="w-8 h-8 rounded bg-white/20 flex items-center justify-center">⏺</button>
          </div>

          <div className="flex items-center gap-2 bg-black/30 px-2 py-1 rounded">
            <span className="text-xs text-white/50">BPM</span>
            <input
              type="number"
              value={bpm}
              onChange={e => setBpm(+e.target.value)}
              className="w-12 bg-transparent text-center font-mono text-[#ff764d]"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Browser */}
        <div className="w-48 bg-[#252525] border-r border-black">
          <div className="p-2 text-xs font-semibold text-white/50 border-b border-black">Browser</div>
          <div className="p-2 space-y-1">
            <div className="flex items-center gap-2 p-1 hover:bg-white/10 rounded cursor-pointer">📁 Sounds</div>
            <div className="flex items-center gap-2 p-1 hover:bg-white/10 rounded cursor-pointer">🎹 Instruments</div>
            <div className="flex items-center gap-2 p-1 hover:bg-white/10 rounded cursor-pointer">🎛️ Audio Effects</div>
            <div className="flex items-center gap-2 p-1 hover:bg-white/10 rounded cursor-pointer">🔌 Plugins</div>
            <div className="flex items-center gap-2 p-1 hover:bg-white/10 rounded cursor-pointer">🎵 Samples</div>
          </div>
        </div>

        {/* Session View */}
        {view === 'session' && (
          <div className="flex-1 overflow-auto">
            <div className="flex">
              {/* Scene buttons */}
              <div className="w-12 bg-[#1a1a1a] border-r border-black">
                <div className="h-8 border-b border-black" />
                {[0, 1, 2, 3].map(scene => (
                  <div key={scene} className="h-20 border-b border-black/50 flex items-center justify-center">
                    <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-xs">
                      ▶
                    </button>
                  </div>
                ))}
              </div>

              {/* Tracks */}
              {tracks.map(track => (
                <div key={track.id} className="w-28 border-r border-black/50">
                  <div
                    className="h-8 flex items-center justify-center text-xs font-medium border-b border-black"
                    style={{ backgroundColor: track.color + '40' }}
                  >
                    {track.name}
                  </div>
                  {[0, 1, 2, 3].map(scene => {
                    const clip = track.clips.find(c => c.scene === scene);
                    return (
                      <div key={scene} className="h-20 border-b border-black/50 p-1">
                        {clip ? (
                          <div
                            onClick={() => toggleClip(track.id, clip.id)}
                            className={`h-full rounded p-1 cursor-pointer transition-all
                              ${clip.playing ? 'ring-2 ring-green-500' : ''}
                            `}
                            style={{ backgroundColor: track.color }}
                          >
                            <div className="text-xs truncate">{clip.name}</div>
                            {clip.playing && <div className="text-xs mt-1">▶ Playing</div>}
                          </div>
                        ) : (
                          <div className="h-full rounded bg-white/5 hover:bg-white/10 cursor-pointer" />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* Add track */}
              <div className="w-28 flex items-start justify-center pt-10">
                <button className="text-3xl text-white/30 hover:text-white/60">+</button>
              </div>
            </div>
          </div>
        )}

        {/* Arrangement View */}
        {view === 'arrangement' && (
          <div className="flex-1 bg-[#1a1a1a] p-4 flex items-center justify-center text-white/40">
            <div className="text-center">
              <div className="text-4xl mb-2">🎼</div>
              <p>Arrangement View</p>
              <p className="text-xs">Drag clips here to arrange</p>
            </div>
          </div>
        )}
      </div>

      {/* Mixer */}
      <div className="h-32 bg-[#252525] border-t border-black flex">
        {tracks.map(track => (
          <div key={track.id} className="w-28 border-r border-black/50 p-2 flex flex-col items-center">
            <div className="flex gap-1 mb-2">
              <button
                onClick={() => toggleTrackMute(track.id)}
                className={`w-6 h-6 rounded text-xs ${track.muted ? 'bg-yellow-600' : 'bg-white/20'}`}
              >
                M
              </button>
              <button
                onClick={() => toggleTrackSolo(track.id)}
                className={`w-6 h-6 rounded text-xs ${track.solo ? 'bg-blue-600' : 'bg-white/20'}`}
              >
                S
              </button>
            </div>
            <input
              type="range"
              className="w-16 h-1 appearance-none bg-white/20 rounded"
              min="-70"
              max="6"
              defaultValue={track.volume}
            />
            <div className="text-xs text-white/50 mt-1">{track.volume} dB</div>
            <div
              className="w-4 h-4 rounded-full mt-1"
              style={{ backgroundColor: track.color }}
            />
          </div>
        ))}
        <div className="w-28 border-r border-black/50 p-2 flex flex-col items-center bg-[#1a1a1a]">
          <div className="text-xs text-white/50 mb-2">Master</div>
          <input
            type="range"
            className="w-16 h-1 appearance-none bg-white/20 rounded"
            min="-70"
            max="6"
            defaultValue={0}
          />
          <div className="text-xs text-white/50 mt-1">0 dB</div>
        </div>
      </div>
    </div>
  );
};

export default AbletonLive;
