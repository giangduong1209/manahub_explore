import { useState, useEffect, useMemo } from 'react';
import { useMoralis } from 'react-moralis';
import InchModal from './components/InchModal';
import useInchDex from 'hooks/useInchDex';
import { Button, Card, Image, Input, InputNumber, Modal } from 'antd';
import Text from 'antd/lib/typography/Text';
import { ArrowDownOutlined, ReloadOutlined } from '@ant-design/icons';
import { useTokenPrice } from 'react-moralis';
import { tokenValue } from 'helpers/formatters';
import { getWrappedNative } from 'helpers/networks';
import dexStyles from './dexStyles.module.css';

// import { useOneInchQuote } from "react-moralis";

const styles = {
  card: {
    width: '430px',
    boxShadow: '0 0.5rem 1.2rem rgb(189 197 209 / 20%)',
    border: '1px solid #e7eaf3',
    borderRadius: '1rem',
    fontSize: '16px',
    fontWeight: '500',
  },
  input: {
    padding: '0',
    fontWeight: '500',
    fontSize: '23px',
    display: 'block',
    width: '100%',
  },
  priceSwap: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '15px',
    color: '#434343',
    marginTop: '8px',
    padding: '0 10px',
  },
  inputfilter: {
    margin: '5px',
    padding: '0',
    fontWeight: '500',
    fontSize: '23px',
    display: 'block',
    width: '100%',
    textAlign: 'center',
  }
};

const nativeAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

const chainIds = {
  '0x1': 'eth',
  '0x38': 'bsc',
  '0x89': 'polygon',
  '0x127': 'p2p',
};

const getChainIdByName = (chainName) => {
  for (let chainId in chainIds) {
    if (chainIds[chainId] === chainName) return chainId;
  }
};

const IsNative = (address) =>
  address === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

function DEX({ chain, customTokens = {} }) {
  const { trySwap, tokenList, getQuote } = useInchDex(chain);

  const { Moralis, isInitialized, chainId } = useMoralis();
  const [isFromModalActive, setFromModalActive] = useState(false);
  const [isToModalActive, setToModalActive] = useState(false);
  const [fromToken, setFromToken] = useState();
  const [toToken, setToToken] = useState();
  const [fromAmount, setFromAmount] = useState();
  const [quote, setQuote] = useState();
  const [currentTrade, setCurrentTrade] = useState();
  const { fetchTokenPrice } = useTokenPrice();
  const [tokenPricesUSD, setTokenPricesUSD] = useState({});

  const [tokensFilter, settokensFilter] = useState();
  const [TotalPrice, setTotalPrice] = useState();
  const [Price, setPrice] = useState();
  const tokens = useMemo(() => {
    return { ...customTokens, ...tokenList };
  }, [customTokens, tokenList]);

  const fromTokenPriceUsd = useMemo(
    () =>
      tokenPricesUSD?.[fromToken?.['address']]
        ? tokenPricesUSD[fromToken?.['address']]
        : null,
    [tokenPricesUSD, fromToken]
  );

  const toTokenPriceUsd = useMemo(
    () =>
      tokenPricesUSD?.[toToken?.['address']]
        ? tokenPricesUSD[toToken?.['address']]
        : null,
    [tokenPricesUSD, toToken]
  );

  const fromTokenAmountUsd = useMemo(() => {
    if (!fromTokenPriceUsd || !fromAmount) return null;
    return `~$ ${(fromAmount * fromTokenPriceUsd).toFixed(4)}`;
  }, [fromTokenPriceUsd, fromAmount]);

  const toTokenAmountUsd = useMemo(() => {
    if (!toTokenPriceUsd || !quote) return null;
    return `~$ ${(
      Moralis.Units.FromWei(quote?.toTokenAmount, quote?.toToken?.decimals) *
      toTokenPriceUsd
    ).toFixed(4)}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toTokenPriceUsd, quote]);

  // tokenPrices
  useEffect(() => {
    if (!isInitialized || !fromToken || !chain) return null;
    const validatedChain = chain ? getChainIdByName(chain) : chainId;
    const tokenAddress = IsNative(fromToken['address'])
      ? getWrappedNative(validatedChain)
      : fromToken['address'];
    fetchTokenPrice({
      params: { chain: validatedChain, address: tokenAddress },
      onSuccess: (price) =>
        setTokenPricesUSD({
          ...tokenPricesUSD,
          [fromToken['address']]: price['usdPrice'],
        }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain, isInitialized, fromToken]);

  useEffect(() => {
    if (!isInitialized || !toToken || !chain) return null;
    const validatedChain = chain ? getChainIdByName(chain) : chainId;
    const tokenAddress = IsNative(toToken['address'])
      ? getWrappedNative(validatedChain)
      : toToken['address'];
    fetchTokenPrice({
      params: { chain: validatedChain, address: tokenAddress },
      onSuccess: (price) =>
        setTokenPricesUSD({
          ...tokenPricesUSD,
          [toToken['address']]: price['usdPrice'],
        }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain, isInitialized, toToken]);

  useEffect(() => {
    // console.log(tokensFilter);
    if (JSON.stringify(tokensFilter) === "{}" || !tokensFilter) {
      let filter = tokens;
      settokensFilter(filter);
    }

    if (!tokens || fromToken) return null;
    setFromToken(tokens[nativeAddress]);
  }, [tokens, fromToken, tokensFilter]);

  const ButtonState = useMemo(() => {
    if (chainIds?.[chainId] !== chain)
      return { isActive: false, text: `Switch to ${chain?.toUpperCase()}` };

    if (!fromAmount) return { isActive: false, text: 'Enter an amount' };
    if (fromAmount && currentTrade) return { isActive: true, text: 'Swap' };
    return { isActive: false, text: 'Select tokens' };
  }, [fromAmount, currentTrade, chainId, chain]);

  useEffect(() => {
    if (fromToken && toToken && fromAmount)
      setCurrentTrade({ fromToken, toToken, fromAmount, chain });
  }, [toToken, fromToken, fromAmount, chain]);

  useEffect(() => {
    if (currentTrade) getQuote(currentTrade).then((quote) => {
      console.log(quote);
      // quote.toTokenAmount = 0;
      setQuote(quote);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrade]);

  const PriceSwap = () => {
    const Quote = quote;
    if (!Quote || !tokenPricesUSD?.[toToken?.['address']]) return null;
    if (Quote?.statusCode === 400) return <>{Quote.message}</>;
    console.log(Quote);
    const { fromTokenAmount, toTokenAmount } = Quote;
    const { symbol: fromSymbol } = fromToken;
    const { symbol: toSymbol } = toToken;
    let pricePerToken = parseFloat(
      tokenValue(fromTokenAmount, fromToken['decimals']) /
      tokenValue(toTokenAmount, toToken['decimals'])
    ).toFixed(6);

    function togleEditPrice() {
      // document.getElementById('inputPrice').style.display = '-webkit-inline-box';
      // document.getElementById('textPrice').style.display = 'none';
      // document.getElementById('iconEditPrice').style.display = 'none';
      setPrice(pricePerToken);
      setTotalPrice(parseFloat(fromTokenAmount / pricePerToken / 10 ** parseInt(toToken['decimals'])).toFixed(6));
    }
    function changePrice(event) {
      console.log(event);
      if (event) {
        if (parseFloat(event) >= 0) {
          let newPrice = event;
          setPrice(newPrice);
          setTotalPrice(parseFloat(fromTokenAmount / newPrice / 10 ** parseInt(toToken['decimals'])).toFixed(6));
        }
      }
    }
    setPrice(pricePerToken);
    setTotalPrice(parseFloat(fromTokenAmount / pricePerToken / 10 ** parseInt(toToken['decimals'])).toFixed(6));
    return (
      <Text style={styles.priceSwap}>
        Price:{' '}
        {/* <Text id='textPrice'>{`1 ${toSymbol} = ${Price} ${fromSymbol} ($${tokenPricesUSD[
          [toToken['address']]
        ].toFixed(6)})`}</Text> */}
        {/* <EditOutlined id='iconEditPrice' onClick={togleEditPrice} /> */}

        <div id='inputPrice' style={{ display: '-webkit-inline-box', marginLeft: '10px' }}>
          <InputNumber
            bordered={false}
            placeholder="0.00"
            style={{ ...styles.input, width: '70%', marginLeft: '-10px' }}
            onChange={changePrice}
            value={Price}
          />
          <Text>{`${fromSymbol} / 1 ${toSymbol}`}</Text>
          <ReloadOutlined onClick={togleEditPrice} style={{ margin: '5px' }} />
        </div>

      </Text>
    );
  };
  // console.log(" chain " + JSON.stringify(chainIds))

  function handleChange(event) {
    let filter = {};
    Object.keys(tokens).forEach(key => {
      let t = tokens[key];
      if (t.name.includes(event.target.value) || t.symbol.includes(event.target.value)) {
        filter[key] = tokens[key];
      }
    });
    settokensFilter(filter);
    // if(event.target.value)
  }
  return (
    <>
      <Card style={styles.card} bodyStyle={{ padding: '18px' }}>
        <Card
          style={{ borderRadius: '1rem' }}
          bodyStyle={{ padding: '0.8rem' }}
        >
          <div
            style={{ marginBottom: '5px', fontSize: '14px', color: '#434343' }}
          >
            From
          </div>
          <div
            style={{
              display: 'flex',
              flexFlow: 'row nowrap',
            }}
          >
            <div>
              <InputNumber
                bordered={false}
                placeholder="0.00"
                style={{ ...styles.input, marginLeft: '-10px' }}
                onChange={setFromAmount}
                value={fromAmount}
              />
              <Text style={{ fontWeight: '600', color: '#434343' }}>
                {fromTokenAmountUsd}
              </Text>
            </div>
            <Button
              style={{
                height: 'fit-content',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: '0.6rem',
                padding: '5px 10px',
                fontWeight: '500',
                fontSize: '17px',
                gap: '7px',
                border: '2px solid #F27252',
              }}
              onClick={() => setFromModalActive(true)}
            >
              {fromToken ? (
                <Image
                  src={
                    fromToken?.logoURI ||
                    'https://etherscan.io/images/main/empty-token.png'
                  }
                  alt="nologo"
                  width="30px"
                  preview={false}
                  style={{ borderRadius: '15px' }}
                />
              ) : (
                <span>Select a token</span>
              )}
              <span>{fromToken?.symbol}</span>
              <Arrow />
            </Button>
          </div>
        </Card>
        <div
          style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}
        >
          <ArrowDownOutlined />
        </div>
        <Card
          style={{ borderRadius: '1rem' }}
          bodyStyle={{ padding: '0.8rem' }}
        >
          <div
            style={{ marginBottom: '5px', fontSize: '14px', color: '#434343' }}
          >
            To
          </div>
          <div
            style={{
              display: 'flex',
              flexFlow: 'row nowrap',
            }}
          >
            <div>
              <Input
                bordered={false}
                placeholder="0.00"
                style={styles.input}
                readOnly
                value={
                  TotalPrice
                  // quote
                  //   ? Moralis.Units.FromWei(
                  //     quote?.toTokenAmount,
                  //     quote?.toToken?.decimals
                  //   ).toFixed(6)
                  //   : ''
                }
              />
              <Text style={{ fontWeight: '600', color: '#434343' }}>
                {toTokenAmountUsd}
              </Text>
            </div>
            <Button
              style={{
                height: 'fit-content',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: '0.6rem',
                padding: '5px 10px',
                fontWeight: '500',
                fontSize: '17px',
                gap: '7px',
                border: '2px solid #F27252',
                // borderColor: "linear-gradient(to bottom, #f27252, #e85443)"
              }}
              onClick={() => setToModalActive(true)}
              type={toToken ? 'default' : ''}
            >
              {toToken ? (
                <Image
                  src={
                    toToken?.logoURI ||
                    'https://etherscan.io/images/main/empty-token.png'
                  }
                  alt="nologo"
                  width="30px"
                  preview={false}
                  style={{ borderRadius: '15px' }}
                />
              ) : (
                <span>Select a token</span>
              )}
              <span>{toToken?.symbol}</span>
              <Arrow />
            </Button>
          </div>
        </Card>

        {quote && (
          <div>
            <Text
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '15px',
                color: '#434343',
                marginTop: '8px',
                padding: '0 10px',
              }}
            >
              Estimated Gas: <Text>{quote?.estimatedGas}</Text>
            </Text>
            <PriceSwap />
          </div>
        )}
        <Button
          className={!ButtonState.isActive ? dexStyles.switchBtn2 : dexStyles.switchBtn}
          type="text"
          size="large"
          onClick={() => trySwap(currentTrade)}
          disabled={!ButtonState.isActive}
        >
          {ButtonState.text}
        </Button>
      </Card>
      <br />
      <Modal
        title="Select a token"
        visible={isFromModalActive}
        onCancel={() => setFromModalActive(false)}
        bodyStyle={{ padding: 0 }}
        width="450px"
        footer={null}
      >
        <Input
          bordered={false}
          placeholder="Search a token"
          style={styles.inputfilter}
          onChange={handleChange}
        />
        <InchModal
          open={isFromModalActive}
          onClose={() => setFromModalActive(false)}
          setToken={setFromToken}
          tokenList={tokensFilter}
        />
      </Modal>
      <Modal
        title="Select a token"
        visible={isToModalActive}
        onCancel={() => setToModalActive(false)}
        bodyStyle={{ padding: 0 }}
        width="450px"
        footer={null}
      >
        <Input
          bordered={false}
          placeholder="Search a token"
          style={styles.inputfilter}
          onChange={handleChange}
        />
        <InchModal
          open={isToModalActive}
          onClose={() => setToModalActive(false)}
          setToken={setToToken}
          tokenList={tokensFilter}
        />
      </Modal>
    </>
  );
}

export default DEX;

const Arrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
