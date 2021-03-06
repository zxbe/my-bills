import * as React from "react";
import {observable, toJS} from "mobx";
import {observer} from "mobx-react";
import {Flex, Icon, List, ListView, NavBar} from "antd-mobile";
import {tableController} from "@services/api";

class AppState {
    @observable listViewDataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });

    asyncLoadData() {
        this.listViewDataSource = this.listViewDataSource.cloneWithRows([]);
        tableController.list("bc_bill_type").then((d) => {
            this.listViewDataSource = this.listViewDataSource.cloneWithRows(d.data);
        });
    }
}

@observer
export default class BillTypeList extends React.Component {
    _appState = new AppState();

    componentDidMount() {
        this._appState.asyncLoadData();
    }

    onAddClick = () => {
        let {match} = this.props;
        let path = match.path.replace(/(.*)(\/[a-z-]+)/, '$1/bill-type-add');
        this.props.history.push(path);
    };

    renderItem = (rowData, sectionID, rowID, highlightRow) => {
        return (
            <List.Item
                arrow="horizontal"
                multipleLine={false}
                onClick={() => {
                }}
            >
                {rowData["name"]}
            </List.Item>
        );
    };

    render() {
        return (
            <Flex
                style={{height: "100%"}}
                direction={"column"}
                align={"center"}>
                <NavBar
                    style={{width: "100%"}}
                    mode="light"
                    icon={<Icon type="left" onClick={() => this.props.history.goBack()}/>}
                    rightContent={<span onClick={this.onAddClick}>新增</span>}
                >{"账单类型"}</NavBar>

                <ListView
                    style={{width: "100%", flex: 1}}
                    dataSource={toJS(this._appState.listViewDataSource)}
                    renderRow={this.renderItem}
                    initialListSize={20}
                    renderSeparator={(sectionID, rowID) => (
                        <div
                            key={rowID}
                            style={{
                                backgroundColor: "#F5F5F9",
                                height: 1,
                                borderTop: "1px solid #ECECED",
                                borderBottom: "1px solid #ECECED"
                            }}
                        />
                    )}
                />
            </Flex>
        )
    }
}
