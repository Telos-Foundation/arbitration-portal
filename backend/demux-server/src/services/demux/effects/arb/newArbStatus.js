function newArbStatusEffect(payload, blockInfo, context) {
    try {
        console.log('NewArbStatus effect PAYLOAD:   ', payload);
        console.log('NewArbStatus effect BlockInfo: ', blockInfo);

        context.socket.emit('newArbStatusAction');
    } catch (err) {
        console.error('NewArbStatus effect error: ', err);
    }
}

export default newArbStatusEffect;