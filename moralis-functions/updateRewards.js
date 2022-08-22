import Moralis from 'moralis-sdk';
exports.handler = async function (event, context){
    try{

        const query = new Moralis.Query('profile');
        query.equalTo("address", event.owner);
        const profile = await query.first();
        console.log('Profile',profile);
        if (profile?.attributes?.refs) {
          let refs = JSON.parse(profile.attributes.refs);
          let price = parseInt(event.price);
          console.log("Refs",refs);
          for (let index = 0; index < refs.length; index++) {
            const el = refs[index];
            console.log('Elements',el, index);
            const queryRef = new Moralis.Query('profile');
            queryRef.equalTo("address", el);
            let refInfo = await queryRef.first();
            console.log( 'refInFo',refInfo);
            if (refInfo) {
                let rw = price / (2 * (refs.length - index) * 2);
                console.log("rewards",rw);
              refInfo.set("rewards", refInfo.attributes.rewards + rw);
              refInfo.set("commission", refInfo.attributes.commission + rw);
              refInfo.save(null, { useMasterKey: true });
            }
          }
        }
        console.groupEnd();
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Successfully!',
                input: event,
            }),
        }
    }catch(err){
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: err.message,
                input: event,
            }),
        }
    }
}