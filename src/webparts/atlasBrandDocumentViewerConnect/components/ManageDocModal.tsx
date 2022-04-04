import * as React from "react";
import { Accordion, Button, Card, Col, Modal, Row, Table } from 'react-bootstrap';

import autobind from 'autobind-decorator';
import styles from './AtlasBrandDocumentViewerConnect.module.scss';

import { Icon, IconButton } from "office-ui-fabric-react";



export default class ManageDocModal extends React.Component<any, any>{

    state = {
        show: false,
        setShow: false,

    }

    @autobind
    setShow(isOpen) {
        this.setState({
            show: isOpen
        })
    }

    render() {

        return (
            <>
                <Button style={{
							fontFamily: "Oswald",
							color: "#fff",
							backgroundColor: "rgb(0 0 0 / 68%)",
							fontWeight: "350",
							fontSize: "1.5em",
							padding: "0.5em 0.75em",
							borderBottom: "0.15em solid #fff",
							width: "100%"
						}} variant="primary" onClick={() => this.setShow(true)}>
                    View All Documents
                </Button>

                <Modal style={{height:"100%"}}
                    show={this.state.show}
                    onHide={() => this.setShow(false)}
                    dialogClassName={styles.modalXl}
                    aria-labelledby="example-custom-modal-styling-title"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="example-custom-modal-styling-title">
                        View All Documents

                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{height:"100%"}}>
                        
                        <iframe src={this.props.rackUrl} width="100%" height="100%" />

                        {/* <h5>{this.props.rackUrl}</h5> */}
                    </Modal.Body>
                </Modal>

                

            </>
        );
    }

}