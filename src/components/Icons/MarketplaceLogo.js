import Icon from '@ant-design/icons';

import { ReactComponent as marketplaceIcon } from './svgs/marketplaceIcon.svg';

const MarketplaceLogo = (props) => {
  return <Icon component={marketplaceIcon} {...props} />;
};

export default MarketplaceLogo;
