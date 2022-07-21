import { useMoralis, useNativeBalance } from 'react-moralis';

function NativeBalance(props) {
  const { data: balance } = useNativeBalance(props);
  const { account, isAuthenticated } = useMoralis();

  if (!account || !isAuthenticated) return null;

  return (
    <div style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
      <p style={{ color: '#e85443', fontSize: '20px' }}>{balance.formatted}</p>
    </div>
  );
}

export default NativeBalance;
