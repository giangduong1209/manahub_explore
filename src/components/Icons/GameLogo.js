import Icon from '@ant-design/icons';

import { ReactComponent as gameIcon } from './svgs/gameIcon.svg';

const GameLogo = (props) => {
  return <Icon component={gameIcon} {...props} />;
};

export default GameLogo;
