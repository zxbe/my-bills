import React from "react";
import {observer} from "mobx-react";
import {Col, Form, Row} from "antd";
import {action, observable, runInAction, toJS} from "mobx";
import * as PropTypes from "prop-types";
import Ajax from "../../../services/Ajax";
import FormDialog from "../../../component/FormDialog";

class AppState {
    @observable siteList = [];
    @observable data = {
        "name": "",
    };
    dialogState = FormDialog.newState();

    constructor() {
        runInAction(() => {
            this.dialogState.width = 800;
        });
    }

    @action
    show(data = {}) {
        this.data = data;
        this.dialogState.visible = true;
        this.dialogState.confirmLoading = false;
    }

    @action
    hide() {
        this.dialogState.visible = false;
        this.dialogState.confirmLoading = false;
    }

    setTitle(title) {
        this.dialogState.title = title;
    }
}

@Form.create()
@observer
export default class DetailDialog extends React.Component {
    static propTypes = {
        state: PropTypes.any,
        onSubmitSuccess: PropTypes.any,
        onSubmitError: PropTypes.any,
        url: PropTypes.any
    };

    static newState() {
        return new AppState();
    }

    constructor(props, context) {
        super(props, context);
        const {state, title} = props;
        state.setTitle(title);
    }

    // 装饰器
    getFieldDecorator = (id, options = {}) => {
        const appState = this.props.state;
        options.initialValue = appState.data[id];
        return this.props.form.getFieldDecorator(id, options);
    };

    render() {
        const {state:appState} = this.props;
        const layout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16},
            style: {width: "100%"},
            colon: true,
        };
        return (
            <FormDialog
                state={appState.dialogState}>

                <Form layout="inline" style={{width: "100%"}}>
                    <Row>
                        <Col span={11}>
                            <Form.Item
                                {...layout}
                                label="登录账号">
                                {appState.data["name"]}
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </FormDialog>
        );
    }
}


