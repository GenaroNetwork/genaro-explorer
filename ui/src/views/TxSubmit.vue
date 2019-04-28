<template>
    <div>
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
                        @click="snackbar = false">
                    Close
                </v-btn>
            </v-snackbar>
            <h1 class="v-title">Submit raw transaction</h1>
            <!-- <v-layout> -->
            <v-form
                    v-model="valid">
                <v-textarea
                        v-model="rawTx"
                        :rules="txRules"
                        label="0x..."
                        rows="20"
                        required>
                </v-textarea>
                <v-btn
                        :disabled="!valid"
                        @click="submit">
                    submit
                </v-btn>
            </v-form>
            <!-- </v-layout> -->
        </v-container>
    </div>
</template>

<style>
    .v-title {
        font-size: 34px !important;
        font-weight: 400;
    }
</style>


<script>
    import Api from '@/api';
    export default {
        name: 'TxSubmit',
        data: () => ({
            snackbar: false,
            valid: true,
            rawTx: '',
            txRules: [
                v => !!v || 'Tx is required',
            ],
            showMessage: null
        }),
        methods: {
            submit: function() {
                Api.sendTransaction(this.rawTx).then(res => {
                    this.setMessage('success', res.data)
                    this.reset()
                }).catch((error) => {
                    this.setMessage("error", error.message)
                })
            },
            reset: function (){
                this.rawTx= ''
            },
            setMessage: function (type, text){
                this.showMessage = {
                    type: type,
                    text: text
                }
                this.snackbar = true
            }
        }
    }
</script>
