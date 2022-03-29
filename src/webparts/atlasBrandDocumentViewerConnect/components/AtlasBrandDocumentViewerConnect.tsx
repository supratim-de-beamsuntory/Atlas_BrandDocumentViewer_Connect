import * as React from 'react';
import styles from './AtlasBrandDocumentViewerConnect.module.scss';
import { IAtlasBrandDocumentViewerConnectProps } from './IAtlasBrandDocumentViewerConnectProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPService } from '../services/SPService';
import autobind from 'autobind-decorator';

import { IoMdDownload } from "react-icons/io";
import { Accordion, Card, Col, Row, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';


export interface IAtlasBrandDocumentViewerConnectState {
	currentDataset: any;
	childTerms: any;
	brandID: any;
	groupedDataSet: any;
	parentTermLabels: any;
}

export default class AtlasBrandDocumentViewerConnect extends React.Component<IAtlasBrandDocumentViewerConnectProps, IAtlasBrandDocumentViewerConnectState> {

	public SPService: SPService = null;

	public constructor(props: IAtlasBrandDocumentViewerConnectProps) {
		super(props);
		this.SPService = new SPService(this.props.context);
		this.state = ({
			currentDataset: [],
			brandID: "",
			childTerms: [],
			groupedDataSet: [],
			parentTermLabels: []
		})

	}

	componentDidMount() {
		let brandID = "Subbrand1647119834538"
		this.getTermsHierarchy();
		this.getAllDocs(brandID);
		// this.categorizeDocs();
	}

	@autobind
	public async categorizeDocs() {
		console.log(this.state.childTerms)
		console.log(this.state.currentDataset)
		let newArr = [];
		let parentTermLabels = [];
		let finalArr = [];
		this.state.childTerms.forEach(async childTerms => {
			let filteredArr = [];
			let flag = 0;
			newArr.length > 0 ? finalArr.push(newArr) : null
			newArr = []
			childTerms.children.forEach(termItem => {

				filteredArr.length > 0 ? newArr.push(filteredArr) : null
				filteredArr = [];

				this.state.currentDataset.forEach(docItem => {
					// console.log(element2.ListItemAllFields.Brand_x0020_Location)
					if (docItem.ListItemAllFields.Brand_x0020_Location)
						if (docItem.ListItemAllFields.Brand_x0020_Location.TermGuid == termItem.id) {
							// let aa = element2.ListItemAllFields.Brand_x0020_Location.Label;
							// newArr = 	filteredArr.concat({ [termItem.defaultLabel]: docItem })
							filteredArr.push(docItem)
							flag = 1
						}
				});
				flag == 1 ? parentTermLabels.push(childTerms.defaultLabel) : null

				// console.log(newArr)
			});
			filteredArr.length > 0 ? newArr.push(filteredArr) : null

		})
		console.log(finalArr);
		newArr.length > 0 ? finalArr.push(newArr) : null
		console.log(finalArr);
		parentTermLabels = [... new Set(parentTermLabels)]
		await this.setState({
			groupedDataSet: finalArr,
			parentTermLabels: parentTermLabels
		})
		console.log(this.state.groupedDataSet)
		console.log(this.state.groupedDataSet.length)
		console.log(this.state.parentTermLabels)

	}

	@autobind
	public async getTermsHierarchy() {
		let childTree = await this.SPService.getTerms();
		this.setState({
			childTerms: childTree
		}, () => this.categorizeDocs())
	}

	@autobind
	public async getAllDocs(brandID) {
		let allDocs = await this.SPService.getAllDocs(brandID)
		console.log(allDocs)
		this.setState({
			currentDataset: allDocs
		})
		// console.log(this.state.childTerms)
	}

	public render(): React.ReactElement<IAtlasBrandDocumentViewerConnectProps> {
		return (
			<>
				{this.state.groupedDataSet.length > 0
					?
					<Row>
						{this.state.groupedDataSet.map((outerGroupDetail, i) => (
							<>
								{outerGroupDetail.length > 0 ?

									<Col>
										<h5>{this.state.parentTermLabels[i]}</h5>
										{outerGroupDetail.map((groupDetail, i) => (
											<Accordion>
												<Card>
													<Accordion.Toggle as={Card.Header} eventKey="0">
														{groupDetail[0].ListItemAllFields.Brand_x0020_Location.Label}
														{'      '}{i}
													</Accordion.Toggle>
													<Accordion.Collapse eventKey="0">
														<Card.Body>
															<Table responsive>
																<thead>
																	<th> Doc Name</th>
																	<th> Doc Download </th>
																</thead>
																{groupDetail.map((itemDetail, j) => (
																	<tbody>
																		<td><a href={itemDetail.ListItemAllFields.ServerRedirectedEmbedUri}>{itemDetail.Name}</a></td>
																	</tbody>
																))}
															</Table>
														</Card.Body>
													</Accordion.Collapse>
												</Card>
											</Accordion>
										))}
									</Col>
									: null}
							</>
						))}
					</Row>
					:
					<h3>Loading...</h3>
				}
				{/* Sup's Section */}
				{/*
				{this.state.groupedDataSet.length > 0 && this.state.groupedDataSet[0].length > 0 ?
					<>
						<h3>Activation</h3>
						{this.state.groupedDataSet[0].map((groupDetail, i) => (
							<Accordion>
								<Card>
									<Accordion.Toggle as={Card.Header} eventKey="0">
										{groupDetail[0].ListItemAllFields.Brand_x0020_Location.Label}
										{'      '}{i}
									</Accordion.Toggle>
									<Accordion.Collapse eventKey="0">
										<Card.Body>
											<Table responsive>
												<thead>
													<th> Doc Name</th>
													<th> Doc Download </th>
												</thead>
												{groupDetail.map((itemDetail, j) => (
													<tbody>
														<td><a href={itemDetail.ListItemAllFields.ServerRedirectedEmbedUri}>{itemDetail.Name}</a></td>
													</tbody>
												))}
											</Table>
										</Card.Body>
									</Accordion.Collapse>
								</Card>
							</Accordion>
						))}
					</>
					:
					<h3>Loading... BBBBBB</h3>
				}
			*/}

				{/* Rohans Secction */}
				{/* <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css"></link>
			<script src='https://kit.fontawesome.com/a076d05399.js'
				crossOrigin='anonymous'></script>
			<div className={styles.atlasBrandDocumentViewerConnect}>

				<ul className={styles.library}>
					<li className={styles.libraryName}>Activation</li>
					<ul className={styles.folder}>
						<li className={styles.folderName}>
							<div>
								<span>Activation Guidelines</span>
								<i className="fa fa-angle-right icon-angle-right"></i>
							</div>
						</li>
						<ul className={styles.docs} style={{display:"block"}}  >
							<li className={styles.doc}>
								<span className="fa fa-star-o icon-star-empty"></span>
								<a className={styles.doc} href="https://connectadmin.beamsuntory.com/CONNECT/brands/rum/cruzan/_layouts/15/WopiFrame.aspx?sourcedoc=/CONNECT/brands/rum/cruzan/Brand Documents/USA/Activation/2018 Cruzan Field Activation Guide PPT.pptx" >2018 Cruzan Field Activation Guide PPT</a>
								<a  data-interception="off" rel="noopener noreferrer" className="docDownload doc-download-link" href="/CONNECT/brands/rum/cruzan/Brand Documents/USA/Activation/2018 Cruzan Field Activation Guide PPT.pptx" download="">
								<IoMdDownload />
								</a>
							</li>
						</ul>
					</ul>
				</ul>


			</div> */}
			</>
		);
	}
}
