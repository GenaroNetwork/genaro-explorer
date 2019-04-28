<template>
    <div>
        <v-container>
            <h1 class="v-title">Verify contract Source</h1>
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
            <v-form
                    v-model="valid">
                <v-text-field
                        v-model="contractAddress"
                        :rules="contractAddressRule"
                        label="Contract address">
                </v-text-field>
                <v-text-field
                        v-model="contractName"
                        :rules="contractNameRule"
                        label="Contract name">
                </v-text-field>
                <v-textarea
                        v-model="contractSource"
                        :rules="contractSourceRule"
                        rows="20"
                        label="Contract Source">
                </v-textarea>
                <v-select
                        v-model="version"
                        :items="versions"
                        :rules="versionRule"
                        label="Compiler Version"
                        required>
                </v-select>
                <v-checkbox
                        v-model="optimize"
                        label="Enable Optimization">
                </v-checkbox>
                <v-btn
                        class="r-btn"
                        :disabled="!valid"
                        @click="submit">
                    submit
                </v-btn>
            </v-form>
        </v-container>
    </div>
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
    import Api from '@/api';
    //import versions from '@/utils/solc-list.js'
    export default {
        name: 'verify_contract',
        data: () => ({
            snackbar: false,
            valid: true,
            contractAddress: '',
            contractAddressRule: [
                v => !!v || 'contractAddress is required'
            ],
            contractName: '',
            contractNameRule: [
                v => !!v || 'contractNameRule is required'
            ],
            contractSource: '',
            contractSourceRule: [
                v => !!v || 'contractSourceRule is required'
            ],
            optimize: false,
            versions: versions,
            version: '',
            versionRule: [
                v => !!v || 'Version is required'
            ],
            showMessage: null
        }),
        methods: {
            submit: function() {
                Api.verifyContract(this.contractAddress, this.contractName, this.contractSource, this.version, this.optimize).then(res => {
                    this.setMessage('success', res.data)
                    this.reset()
                }).catch((error) => {
                    this.setMessage('error', error.message)
                })
            },
            reset: function (){
                this.contractAddress = ''
                this.contractName = ''
                this.version = ''
                this.optimize = false
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
