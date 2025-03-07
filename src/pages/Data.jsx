import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

const Data = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [resultObj, setResultObj] = useState({});


  async function decodeActionUrl(returnData) {
    const mydata = await gc.encodings.msg.decoder(returnData);
    setResultObj(mydata);
  }

  useEffect(() => {
    let returnData = searchParams.get("d");
    console.log(returnData);

    decodeActionUrl(returnData);
  }, []);

  useEffect(() => {
    console.log("results")
    
    if (Object.keys(resultObj).length !== 0) {

      let returnDataKey = Object.keys(resultObj.exports)[0] 
      console.log(returnDataKey)

      if (returnDataKey == "userData") {
        let userdata = resultObj.exports.userData
        let pubKey = userdata.addressInfo.paymentKeyHash
        let stakeKey = userdata.addressInfo.stakingKeyHash
        // console.log(pubKey)
        let id = userdata.id

        let members = JSON.parse(localStorage.getItem("members_0"));

        if (members !== null) {
          // console.log("memers_0", members[resultObj.exports.userData.id] );

          members[id].pubKey = pubKey
          members[id].stakeKey = stakeKey
          // console.log(members)
          localStorage.setItem("members_0", JSON.stringify(members))
        }

        
      } else if (returnDataKey == "daoWalletData") {

        let key = Object.keys(resultObj.exports.daoWalletData.getAddress)
        // console.log(key)
        let address = resultObj.exports.daoWalletData.getAddress[key].address
        console.log(address)


        let daoInfo = JSON.parse(localStorage.getItem("daoInfo_0"));

        if (daoInfo !== null) {
          daoInfo.address = address

          localStorage.setItem("daoInfo_0", JSON.stringify(daoInfo))
        }

      } else if (returnDataKey == "dnoWalletData") {

        console.log(resultObj.exports.dnoWalletData)

        let dnoData = resultObj.exports.dnoWalletData
  
        let address = dnoData.address
        console.log(address)

        localStorage.setItem("login_0", JSON.stringify(address))

      }  else {
        console.log(resultObj.exports)
      }

    }
  }, [resultObj])

  // Comment out the window close for debugging the return value
  
  let projectState = import.meta.env
  console.log(projectState)

  console.log(projectState.DEV)

  if (projectState.DEV) {
    console.log("dev mode")
  } else {
    console.log("production mode")
    window.close
  }

  return (<h1>Results</h1>)
};

export default Data;
