import './index.css'
import React from 'react'
import * as PropTypes from 'prop-types'
import mario from './mariobros.mp3'
import FaPause from 'react-icons/lib/fa/pause'
import FaPlay from 'react-icons/lib/fa/play'
import FaRepeat from 'react-icons/lib/fa/repeat'
import FaRotateLeft from 'react-icons/lib/fa/rotate-left'

class AudioPlayer extends React.Component {
  static propTypes = {
    source: PropTypes.string.isRequired
  }
  static childContextTypes = {
    audio: PropTypes.object.isRequired
  }

  state = {
    isPlaying: false,
    duration: null,
    loaded: false,
    currentTime: 0
  }

  getChildContext() {
    return {
      audio: {
        ...this.state,
        setTime: (time) => {
          this.audio.currentTime = time;
        },
        isPlaying: this.state.isPlaying,
        jump: (by) => {
          this.audio.currentTime = this.audio.currentTime + by;
        },
        play: () => {
          this.audio.play();
          this.setState({ isPlaying: true});
        },
        pause: () => {
          this.audio.pause();
          this.setState({isPlaying: false});
        }
      }
    }
  }

  handleLoaded = () => {
    this.setState({
      loaded: true,
      duration: this.audio.duration
    });
  }

  handleTimeUpdate = () => {
    this.setState({
      currentTime: this.audio.currentTime
    });
  }

  handleEnded = () => {
    this.setState({
      isPlaying: false
    });
  }

  render() {
    const { source } = this.props;
    return (
      <div className="audio-player">
        <audio
          src={source}
          onTimeUpdate={this.handleTimeUpdate}
          onLoadedData={this.handleLoaded}
          onEnded={this.handleEnded}
          ref={n => this.audio = n}
        />
        {this.props.children}
      </div>
    )
  }
}

class Play extends React.Component {
  static contextTypes = {
    audio: PropTypes.object.isRequired
  }
  render() {
    return (
      <button
        className="icon-button"
        onClick={this.context.audio.play}
        disabled={this.context.audio.isPlaying}
        title="play"
      ><FaPlay/></button>
    )
  }
}

class Pause extends React.Component {
  static contextTypes = {
    audio: PropTypes.object.isRequired
  }

  render() {
    return (
      <button
        className="icon-button"
        onClick={this.context.audio.pause}
        disabled={!this.context.audio.isPlaying}
        title="pause"
      ><FaPause/></button>
    )
  }
}

class PlayPause extends React.Component {
  static contextTypes = {
    audio: PropTypes.object.isRequired
  }

  render() {
    const { isPlaying } = this.context.audio;
    return isPlaying ? <Pause/> : <Play/>;
  }
}

class JumpForward extends React.Component {
  static contextTypes = {
    audio: PropTypes.object.isRequired
  }

  render() {
    return (
      <button
        className="icon-button"
        onClick={() => {
          this.context.audio.jump(10);
        }}
        disabled={!this.context.audio.isPlaying}
        title="Forward 10 Seconds"
      ><FaRepeat/></button>
    )
  }
}

class JumpBack extends React.Component {
  static contextTypes = {
    audio: PropTypes.object.isRequired
  }

  render() {
    return (
      <button
        className="icon-button"
        onClick={() => {
          this.context.audio.jump(-10);
        }}
        disabled={!this.context.audio.isPlaying}
        title="Back 10 Seconds"
      ><FaRotateLeft/></button>
    )
  }
}

class Progress extends React.Component {
  static contextTypes = {
    audio: PropTypes.object.isRequired
  }

  render() {
    const { currentTime, duration, loaded } = this.context.audio;
    const width = loaded ? currentTime / duration : 0;
    return (
      <div
        className="progress"
        ref={n => this.node = n}
        onClick={(event) => {
          const rect = this.node.getBoundingClientRect();
          const relativeLeft = event.clientX - rect.left;
          const multiplier = relativeLeft / rect.width;
          const time = multiplier * this.context.audio.duration;
          this.context.audio.setTime(time);
        }}
      >
        <div
          className="progress-bar"
          style={{
            width: `${width * 100}%`
          }}
        />
      </div>
    )
  }
}

const App = () => (
  <div className="app">
    <AudioPlayer source={mario}>
      <Play/> <Pause/>{' '}
      <span className="player-text">Mario Bros. Remix</span>
      <Progress/>
    </AudioPlayer>

    <AudioPlayer source={mario}>
      <PlayPause/> <JumpBack/> <JumpForward/> {' '}
      <span className="player-text">Mario Bros. Remix</span>
      <Progress/>
    </AudioPlayer>
  </div>
)

export default App
