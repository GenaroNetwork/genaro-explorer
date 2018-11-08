<template>
  <v-container>
     <v-snackbar
      :top="true"
      v-if="showMessage"
      v-model="snackbar"
      :color="showMessage.type">
      {{ showMessage.text }}
      <v-btn
        dark
        flat
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
    <h1 class="v-title">Verify Signature</h1>
    <v-form
      v-model="valid">
      <v-text-field
        label="Genaro Address"
        v-model="address"
        :rules="genAddRules">
      </v-text-field>
      <v-text-field
        label="Message"
        v-model="message"
        :rules="messageRules">
      </v-text-field>
      <v-text-field
        label="Signature (obtained via eth.sign(address, web3.sha3(message))"
        v-model="signature"
        :rules="signatureRules">
      </v-text-field>
      <v-btn 
        class="r-btn"
        :disabled="!valid"
        @click="submit">
        submit
      </v-btn>
    </v-form>
  </v-container>
</template>


<style>
  .r-btn {
    float: right;
  }
  .v-title {
    font-size: 34px !important;
    font-weight: 400;
  }
</style>


<script>
  var utils =  require('ethereumjs-util')
  export default {

    name: 'verify_signature',
    data: () =>({
      snackbar: false,
      showMessage: null,
      valid: true,
      address: '',
      genAddRules: [
        v => !!v || 'GenaroAddress is required',
      ],
      message: '',
      messageRules: [
        v => !!v || 'Message is required'
      ],
      signature: '',
      signatureRules: [
        v => !!v || 'Signature is required'
      ]
    }),
    methods: {
      submit: function() {
        this.verifySign(this.address, this.message, this.signature)
      },
      verifySign: function(address, message, signature) {
        let _address = address.toLowerCase().replace("0x","");
        try {
          let msgSha = utils.sha3(message);
          let sigDecoded = utils.fromRpcSig(signature);
          let recoveredPub = utils.ecrecover(msgSha, sigDecoded.v, sigDecoded.r, sigDecoded.s);
          let recoveredAddress = utils.pubToAddress(recoveredPub).toString("hex");

          if (address === recoveredAddress) {
            this.setMessage('success', 'Signature is valid!')
            this.reset()
          } else {
            this.setMessage('error', 'Signature is not valid!')
          }

        } catch(e) {
          this.setMessage('error', `Error during signature verification: ${e}`)
        }
      },
      setMessage: function (type, text){
        this.showMessage = {
          type: type,
          text: text
        }
        this.snackbar = true
      },
      reset: function (){
        this.address = ''
        this.contractName = ''
        this.signature = ''
      }
    }
    
  }
</script>

