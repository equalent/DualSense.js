let controller = null;

function getInitialState() {
    return {
        isConnected: false,
        controller: null,
        controllerName: '',
        state: new DualSense.DSControllerState(),
        connectionType: '',
        leftMotor: 0,
        rightMotor: 0,
        ledColor: { r: 0, g: 0, b: 0 }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    Vue.createApp({
        data: () => getInitialState(),
        watch: {
            ledColor: {
                handler(newColor) {
                    if (this.isConnected) {
                        this.controller.ledColor = newColor;
                    }
                },
                deep: true
            },
            leftMotor(newValue) {
                if (this.isConnected) {
                    this.controller.leftMotor = newValue;
                }
            },
            rightMotor(newValue) {
                if (this.isConnected) {
                    this.controller.rightMotor = newValue;
                }
            },
        },
        methods: {
            async connect(evt) {
                this.controller = await DualSense.connectController();
                this.controllerName = this.controller.productName;
                this.isConnected = true;

                this.controller.addEventListener('stateChange', (evt) => {
                    this.connectionType = this.controller.connectionType;
                    this.state = Object.assign({}, evt.state);
                });
            },
            async disconnect(evt) {
                await this.controller.disconnect();
                this.controller = null;
                this.isConnected = false;

                Object.assign(this.$data, getInitialState());
            }
        }
    }).mount('#app');
});