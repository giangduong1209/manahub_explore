import Icon from '@ant-design/icons';
import { ReactComponent as Fire } from './svgs/fireIcon.svg';
import { ReactComponent as Gem } from './svgs/gem.svg';
import { ReactComponent as Ball } from './svgs/baseketball.svg';
import { ReactComponent as Female } from './svgs/female.svg';
import { ReactComponent as Playstation } from './svgs/playstation.svg';
import { ReactComponent as Copy } from './svgs/copy.svg';

export const FireIcon = (props) => {
  return <Icon component={Fire} {...props} style={{ color: 'currentcolor' }} />;
};

export const GemIcon = (props) => {
  return <Icon component={Gem} {...props} style={{ color: 'currentcolor' }} />;
};

export const BaseketBallIcon = (props) => {
  return <Icon component={Ball} {...props} style={{ color: 'currentcolor' }} />;
};

export const FemaleIcon = (props) => {
  return (
    <Icon component={Female} {...props} style={{ color: 'currentcolor' }} />
  );
};

export const PlaystationIcon = (props) => {
  return (
    <Icon
      component={Playstation}
      {...props}
      style={{ color: 'currentcolor' }}
    />
  );
};

export const CopyIcon = (props) => {
  return <Icon component={Copy} {...props} />;
};
