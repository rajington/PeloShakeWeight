import * as React from "react";
import * as GyroNorm from "gyronorm";
import styled from "react-emotion";

type Acceleration = {
  x: number;
  y: number;
  z: number;
};

type State = {
  energy: number;
  error?: string;
  energyPerSecond: number;
  gn: any;
};

export default class ShakeWeight extends React.Component<{}, State> {
  public state: State = {
    energy: 0,
    energyPerSecond: 0,
    gn: new GyroNorm()
  };

  // private previousEnergy = 0;
  private previousTime = new Date().getTime();

  public async componentDidMount() {
    try {
      await this.state.gn.init();
    } catch (error) {
      this.setState({ error: error.message });
      return;
    }
    this.state.gn.start(this.updateStats);
  }

  private updateStats = ({ dm: { x, y, z } }: { dm: Acceleration }) =>
    this.setState(({ energy }) => {
      const time = new Date().getTime();
      const newEnergy =
        (Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2)) *
        Math.pow(time - this.previousTime, 2);
      this.previousTime = time;
      return {
        energy: energy + newEnergy
      };
    });

  private reset = () => {
    this.previousTime = new Date().getTime();
    this.setState({ energy: 0 });
  };

  public render() {
    const { energy, energyPerSecond, error } = this.state;
    return error ? (
      <div>{error}</div>
    ) : (
      <Container onClick={this.reset}>
        <YourValues>
          <Value>{Math.round(energy / 1000) / 1000} kJ</Value>
          <Value>{energyPerSecond} kJ/sec</Value>
        </YourValues>
      </Container>
    );
  }
}

const Container = styled("div")(() => ({
  alignContent: "center",
  display: "flex",
  justifyContent: "center"
}));

const YourValues = styled("div")(() => ({
  backgroundColor: "blue",
  border: "4px solid pink",
  borderRadius: "20px",
  color: "white",
  padding: "50px"
}));

const Value = styled("div")(() => ({}));
