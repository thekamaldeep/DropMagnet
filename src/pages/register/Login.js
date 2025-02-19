import React, { useRef, useState } from "react";
import { useAuth } from "../../contexts/FirebaseAuthContext";
import { Link, useHistory, useParams } from "react-router-dom";
import {
  FormWrapper,
  FormBtn,
  FormAlert,
  FormInput,
  FormLabel,
  GridItem,
  FormSuccess,
} from "./FormComponents";
import HeaderBar from "../../components/elements/HeaderBar/HeaderBar";
import { getUserProfile } from "../../DropMagnetAPI";
import Spinner from "../../components/blocks/spinner";

import Web3 from "web3";
import Web3Modal, { getProviderInfoByName } from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Fortmatic from "fortmatic";
import WalletLink from "walletlink"
import * as DropMagnetAPI from "../../DropMagnetAPI"

import axios from "axios"


export default function Login() {

  let pubAdd = JSON.stringify(localStorage.getItem('publicAddress'))
  const { id } = useParams()
  console.log(id)

  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, signInWithCustomToken, currentUser, sendSignInLinkToEmail } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("")

  const [address, setAddress] = useState(pubAdd || '')

  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("Entered submit here.....")

    try {
      setError("");
      setLoading(true);
      const res = await login(
        emailRef.current.value,
        passwordRef.current.value
      );

      let tk = await res.user.getIdToken()

      getUserProfile(res.user.uid, tk).then(function (response) {
        console.log('user profile response', response)
        if (response.status === "error") {
          // setLoginError(response.message);
          setLoading(false);
        } else {
          localStorage.setItem('userDetails', JSON.stringify(response));
          if (res.user.emailVerified) {
            if (id) {
              history.push(`/drop/${id}`);
            }
            else {
              sessionStorage.removeItem('headerLoad')
              history.push("/home");
            }
          } else {
            setError("Email not verified!! check your inbox and verifiy");
            setLoading(false);
          }
        }
      })
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }


  async function handleSubmitEmailLink(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      const email = emailRef.current.value

      let res = await DropMagnetAPI.isUser(email)

      console.log(res)

      if (res.status) {
        sendSignInLinkToEmail(email)
          .then(res => {
            localStorage.setItem('emailForSignIn', email)
            setMessage("Email link sent. Please check email.")
            setLoading(false)
          })
          .catch(error => {
            setError(error.message);
            setLoading(false);
          });
      }

      else{
        setError("This email is not registered.");
        setLoading(false);
      }


    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  const coinbase = getProviderInfoByName('Coinbase')

  const walletLink = new WalletLink({
    appName: "Dropmagnet",
    appLogoUrl: "https://example.com/logo.png",
    darkMode: "false"
  })

  const ethereum = walletLink.makeWeb3Provider(
    "https://ropsten.infura.io/v3/dc1c5b7b227d4885a03cf5eeb5e3224c", 1
  )

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        // infuraId: "dc1c5b7b227d4885a03cf5eeb5e3224c",
        infuraId: "dc1c5b7b227d4885a03cf5eeb5e3224c",
      }
    },

    fortmatic: {
      package: Fortmatic,
      options: {
        key: "pk_live_201A6F01A7385804"
      }
    },
    "custom-coinbase": {
      display: {
        logo: coinbase.logo,
        name: coinbase.name
      },
      package: ethereum,
      connector: async () => {
        const provider = ethereum;
        await provider.enable()
        return provider;
      }
    }
  };

  const web3Modal = new Web3Modal({
    cacheProvider: false,
    providerOptions: providerOptions,
    theme: "dark",
  });

  const userLogin = async (token) => { // This one is for wallet
    const res = await signInWithCustomToken(token)
      .then(cred => cred)

    let tk = await res.user.getIdToken()
    localStorage.setItem("token", tk)

    await getUserProfile(res.user.uid, tk)
    .then((response) => {
      console.log('user profile response', response)
      if(response === null) {
        history.push("/create")
      }
      else {
      if (response?.status === "error") {
        setLoading(false);
      } else {
        setLoading(false)
        localStorage.setItem('userDetails', JSON.stringify(response));
        if (id) {
          history.push(`/drop/${id}`);
          setLoading(false)
        }
        else {
          sessionStorage.removeItem('headerLoad')
          history.push("/home");
          setLoading(false)
        }
      }
    }
    })
  }

  const signMessageV2 = async (web3, accounts, nonce) => {
    let _signature, token

    await web3.eth.personal.sign(
      web3.utils.fromUtf8(`Sign In to DropMagnet: ${nonce.nonce}`),
      accounts[0],
      (err, signature) => {
        if (err) console.log(err)
        _signature = signature
        console.log("signature: ", signature, _signature)
      }
    )

    await axios.post("https://drop-api-rnd454q4pa-ew.a.run.app/auth", {
      addr: accounts[0], 
      sig: _signature,
    })
    .then(res => {
      console.log(res.data.token)
      token = res.data.token
    })
    .catch(err => {
      if (err.message.includes("401")) {
        // history.push("/getToken")
        setError("No access")
      }
    })

    localStorage.setItem('token', token)
    await userLogin(token)
  }

  const signMessage = async (web3, accounts, nonce) => {
    console.log(nonce.token)
    let message = `You are signing in to DropMagnet: ${nonce.data}`
    await web3.eth.personal.sign(message, accounts[0], async function (error, result) {
      if (error) {
        console.log(error)
        alert("Error occurred!")
        setLoading(false)
      }
      else {
        const signingAddress = await web3.eth.accounts.recover(message,
          result);
        if (accounts[0] === signingAddress) {
          setLoading(true)
          localStorage.setItem('publicAddress', accounts[0])

          if (nonce.status === 0) {
            setLoading(false)
            history.push("/create")
          }
          else {
            userLogin(nonce.token)
          }
        }
        else {
          setLoading(false)
          alert("Signature not verified.")
        }
      }

    })

  }


  const connectWallet = async () => {
    const provider = await web3Modal.connect();
    const wb = new Web3(provider);
    setLoading(true)
    let accounts = await wb.eth.getAccounts()
    // let accounts = await provider.eth.getAccounts()
      .then(acc => acc)
    let nonce = await DropMagnetAPI.getNonce(accounts[0])

    // await signMessage(wb, accounts, nonce);
    await signMessageV2(wb, accounts, nonce)
    // await signMessageV2(provider, accounts, nonce)
  }

  return (
    <div>
      <div className="header-container">
        <div className="header-left-holder">
          <img alt={'logo'} style={{ width: 36, height: 'auto' }} onClick={() => {
            history.push('/');
          }} className="header-left-image clickable" src="./drop_logo.png" />

        </div>
      </div>
      <div style={{ height: 'calc(100vh - 68px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <FormWrapper>
          <form className="formGrid" onSubmit={handleSubmitEmailLink}>
            <h2 className="text-center mb-4">Log In</h2>
            {error && <FormAlert variant="danger">{error}</FormAlert>}
            {message && <FormSuccess variant="success">{message}</FormSuccess>}
            {!loading && !message ? (
              <>
                <GridItem id="email">
                  <FormLabel>Email</FormLabel>
                  <FormInput type="email" ref={emailRef} required />
                </GridItem>
                {!loading && (
                  <FormBtn disabled={loading} className="w-100" type="submit">
                    <p style={{ margin: '0', marginTop: '3px' }}>Log In</p>
                  </FormBtn>
                )}

                <GridItem>
                  <Link to="/forgot-password">Forgot Password?</Link>
                </GridItem>

                <GridItem>
                  Need an account? <Link to="/signup">Sign Up</Link>
                </GridItem></>
            ) : !message ? <Spinner /> : null}
          </form>

          {!loading && !message && (
            <FormBtn className="w-100" type="submit"
              onClick={connectWallet}
              style={{ marginTop: "20px" }}>
              <p style={{ margin: '0', marginTop: '3px' }}>Sign In Using Wallet</p>
            </FormBtn>
          )}

        </FormWrapper>
      </div>
    </div>
  );
}
