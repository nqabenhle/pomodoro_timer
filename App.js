import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Pressable } from 'react-native';
import Constants from 'expo-constants';

import {vibrate} from './utils'

class Counter extends Component {
  constructor(props) {
    super(props)
    this.studyTime = 1500
    this.breakTime = 300
    this.state = {
      seconds: 1500,
      study: true,
      showTimeInput: false
    }
  }

  _saveUserTimePeriod = () => {
    this.studyTime = this.newStudyTime ? (this.newStudyTime * 60) : 1500
    this.breakTime = this.newBreakTime ? (this.newBreakTime * 60) : 300
    this.showHideTimeInput()
    this.resetTime()
  }

  changeInSeconds = () => {
    if (this.state.seconds > 0) {
      this.setState(prevState => ({
        seconds: prevState.seconds - 1
      }))
    } 
    else {
      vibrate()
    }
  }

  numberToTimeFormat = (number, format='seconds') => {
    if (format === 'minutes') {
      minutes = Math.floor(number / 60)
      return minutes < 10 ? `0${minutes}` : minutes
    }
    else {
      seconds = number - (Math.floor(number / 60) * 60)
      return seconds < 10 ? `0${seconds}` : seconds
    }
  }

  pauseTime = () => clearInterval(this.secondsInterval)

  resetTime = () => {
    if (this.state.study && this.state.seconds) {
      this.setState({seconds: this.studyTime})
    } 
    else if (!this.state.study && this.state.seconds) {
      this.setState({seconds: this.breakTime})
    }
    else {
      this.setState(prevState => ({
        seconds: prevState.study ? this.breakTime : this.studyTime,
        study: !prevState.study
      }))
    }
  }

  resumeTime = () => {
    clearInterval(this.secondsInterval)
    this.secondsInterval = setInterval(this.changeInSeconds, 1000)
  }

  showHideTimeInput = () => {
    this.pauseTime()
    this.setState(prevState => ({
      showTimeInput: !prevState.showTimeInput
    }))
  }

  componentWillUnmount() {
    clearInterval(this.secondsInterval)
  }

  render() {
    return (
      <View>
        { this.state.showTimeInput &&
          <View style={[styles.card, styles.timeInputContainer]}>
            <TextInput
              onChangeText={(time) => this.newStudyTime = time}
              style={styles.input} 
              placeholder='Study Time in minutes'keyboardType='numeric' 
            />
            <TextInput
              onChangeText={(time) => this.newBreakTime = time}
              style={styles.input} 
              placeholder='Break Time in minutes' keyboardType='numeric'
            />
            <ActionButton name='Save'
             action={this._saveUserTimePeriod} 
            />
          </View>
        }

        <Text style={styles.headerText}>
          {this.state.study ? 'Study Time' : 'Break Time' }
        </Text>

        <View style={styles.card}>
          <Pressable onPress={this.showHideTimeInput}>
            <Text style={styles.countText}>
              {this.numberToTimeFormat(this.state.seconds, 'minutes')}:{this.numberToTimeFormat(this.state.seconds)}
            </Text>
          </Pressable>
        </View>

        <View style={styles.buttonsContainer}>
          <ActionButton name='STOP' action={this.pauseTime} />
          <ActionButton name='START' action={this.resumeTime} />
          <ActionButton name='RESET' action={this.resetTime} />
        </View>
      </View>
    )
  }
}

function ActionButton(props) {
  return (
    <TouchableOpacity style={styles.button} onPress={props.action}>
      <Text style={{color: '#fff'}}>{props.name}</Text>
    </TouchableOpacity>
  )
}

export default function App() {
  return (
    <View style={styles.container}>
      <Counter />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'royalblue',
    justifyContent: 'center',
    alignItems: 'center',
    width: '30%',
    height: 37,
    borderRadius: 20
  },
  buttonsContainer: {
    paddingLeft: 40,
    paddingRight: 40,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }, 
  card: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#271e4b',
    padding: 8,
  },
  countText: {
    fontSize: 24,
    fontWeight: 600,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 500,
    color: '#fff'
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  timeInputContainer: {
    position: 'absolute',
    zIndex: 2,
    left: '10%',
  },
});