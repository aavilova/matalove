import React, { PureComponent } from 'react'

export default class SC_Knob extends PureComponent {
  constructor(props) {
    super(props)

    const { min, max } = props
    const range = max - min
    const coef = 280 / range
    const stepCoef = Math.floor(range / 6)

    this.state = {
      mouseDown: false,
      deg: 0,
      cursorY: 0,
      bullets: [],
      range,
      coef,
      stepCoef
    }
  }

  componentDidMount() {
    window.addEventListener('mouseup', this.handleMouseUp)
    window.addEventListener('mousemove', this.handleMouseMove)

    const { value } = this.props
    const { range } = this.state

    this.setState({
      deg: this.calcDeg(value),
      bullets: this.calsBulletValues()
    })
  }

  calcDeg = (value) => {
    const { min } = this.props
    const { coef } = this.state

    if (min < 0) {
      return value * coef
    } else {
      return value * coef - 140
    }
  }

  calcRotation = (range) => {
    const { coef, deg } = this.state
    return range * coef + deg
  }

  calcValue = (deg) => {
    const { min } = this.props
    const { range } = this.state

    if (min < 0) {
      return Math.floor((range / 280) * deg)
    } else {
      return Math.floor((range / 280) * (deg + 140))
    }
  }

  calsBulletValues = () => {
    const { min, max } = this.props
    const { range, stepCoef } = this.state
    const bullets = []

    if (Math.sign(min) == 1) {
      for (var i = 0; i < 5; i++) {
        bullets.push(Math.floor(stepCoef * (i + 1)))
      }
    } else if (Math.sign(min) == -1) {
      if (Math.sign(max) == -1) {
        for (var i = 0; i < 5; i++) {
          bullets.push(Math.floor(-stepCoef * (i + 1)))
        }

        bullets.reverse()
      } else {
        bullets.push(Math.floor(-stepCoef * 2))
        bullets.push(Math.floor(-stepCoef * 1))
        bullets.push(Math.floor(stepCoef * 0))
        bullets.push(Math.floor(stepCoef * 1))
        bullets.push(Math.floor(stepCoef * 2))
      }
    } else if (Math.sign(min) == 0) {
      for (var i = 0; i < 5; i++) {
        bullets.push(Math.floor(stepCoef * (i + 1)))
      }
    }

    return bullets
  }

  handleMouseDown = (e) => {
    e.preventDefault()

    this.setState({
      mouseDown: true,
      cursorY: e.screenY
    })
  }

  handleMouseMove = (e) => {
    const { property, min, max, handleChange } = this.props
    const { mouseDown, cursorY } = this.state

    if (mouseDown) {
      const cursorRange = cursorY - e.screenY

      if (cursorRange != 0) {
        let nextDeg = this.calcRotation(cursorRange)
        let nextValue = this.calcValue(nextDeg)

        if (nextValue <= min) {
          nextDeg = -140
          nextValue = min
        } else if (nextValue >= max) {
          nextDeg = 140
          nextValue = max
        } else {
          nextValue = this.calcValue(nextDeg)
        }

        handleChange(property, nextValue)

        this.setState({
          cursorY: e.screenY,
          deg: nextDeg
        })
      }
    }
  }

  handleMouseUp = (e) => {
    e.preventDefault()

    const { mouseDown } = this.state

    if (mouseDown) {
      this.setState({
        mouseDown: false,
        cursorY: 0
      })
    }
  }

  render() {
    const { min, max, value, name } = this.props
    const { bullets, deg } = this.state

    const styles = {
      transform: `rotate(${deg}deg)`
    }

    return (
      <div className="SC_Knob" onMouseDown={this.handleMouseDown}>
        <h3>{name}</h3>

        <div className="wrapper">
          <div className="body">
            <div style={styles}></div>
          </div>
        </div>
      </div>
    )
  }
}


