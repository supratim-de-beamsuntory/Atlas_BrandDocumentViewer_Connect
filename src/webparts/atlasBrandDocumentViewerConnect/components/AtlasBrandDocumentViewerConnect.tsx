import * as React from 'react';
import styles from './AtlasBrandDocumentViewerConnect.module.scss';
import { IAtlasBrandDocumentViewerConnectProps } from './IAtlasBrandDocumentViewerConnectProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPService } from '../services/SPService';
import autobind from 'autobind-decorator';

import { IoMdDownload, IoIosArrowForward } from "react-icons/io";
import { Accordion, Card, Col, Container, Row, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

import { Icon } from '@fluentui/react/lib/Icon';
import { getFileTypeIconProps, FileIconType, initializeFileTypeIcons } from '@fluentui/react-file-type-icons';
import ManageDocModal from './ManageDocModal';
import { WebPartContext } from '@microsoft/sp-webpart-base';

import "./ManageDocModal.css"


initializeFileTypeIcons(undefined);


export interface IAtlasBrandDocumentViewerConnectState {
	currentDataset: any;
	allTerms: any;
	brandID: any;
	groupedDataSet: any;
	parentTermLabels: any;
	hrefString : any;

}

export default class AtlasBrandDocumentViewerConnect extends React.Component<IAtlasBrandDocumentViewerConnectProps, IAtlasBrandDocumentViewerConnectState> {

	public SPService: SPService = null;


	public constructor(props: IAtlasBrandDocumentViewerConnectProps) {
		super(props);
		this.SPService = new SPService(this.props.context);

		this.state = ({
			currentDataset: [],
			brandID: "",
			allTerms: [],
			groupedDataSet: [],
			parentTermLabels: [],
			hrefString : ""
		})

	}

	public async componentDidMount(): Promise<void> {
		let brandID = "Subbrand1647119834538";

		const myArray = window.location.href.split("/");
		// let brandID = myArray[myArray.length - 1].split(".")[0];

		let allTerms = await this.getTermsHierarchy();
		let allDocs = await this.getAllDocs(brandID);
		await this.setState({
			allTerms: allTerms,
			currentDataset: allDocs,
			hrefString :  `https://devbeam.sharepoint.com/sites/ModernConnect/Brand%20Documents/${brandID}`
		})
		if (this.state.allTerms && this.state.currentDataset)
			this.categorizeDocs();


		// this.categorizeDocs(); 
		// this.hrefString = `https://devbeam.sharepoint.com/sites/ModernConnect/Brand%20Documents/${brandID}`;

		console.log(this.state.hrefString);

	}

	@autobind
	public async categorizeDocs() {
		console.log(this.state.allTerms)
		console.log(this.state.currentDataset)
		let newArr = [];
		let parentTermLabels = [];
		let finalArr = [];
		this.state.allTerms.forEach(async childTerms => {
			let filteredArr = [];
			let flag = 0;
			newArr.length > 0 ? finalArr.push(newArr) : null
			newArr = []
			childTerms.children.forEach(termItem => {

				filteredArr.length > 0 ? newArr.push(filteredArr) : null
				filteredArr = [];

				this.state.currentDataset.forEach(docItem => {
					// console.log(element2.ListItemAllFields.Brand_x0020_Location)
					if (docItem.Brand_x0020_Location)
						if (docItem.Brand_x0020_Location.TermGuid == termItem.id) {
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
		return childTree
		// this.setState({
		// 	allTerms: childTree
		// }, () => this.categorizeDocs())
	}

	@autobind
	public async getAllDocs(brandID) {
		// let allDocs = await this.SPService.getAllDocs(brandID)
		let allDocs = await this.SPService.getAllDocs2(brandID)

		console.log(allDocs)
		return allDocs
		// this.setState({
		// 	currentDataset: allDocs
		// }, () => this.categorizeDocs())
		// console.log(this.state.childTerms)
	}

	public render(): React.ReactElement<IAtlasBrandDocumentViewerConnectProps> {
		return (
			<Container fluid>
				{this.state.groupedDataSet.length > 0
					?
					<>
						<Row >
							{this.state.groupedDataSet.map((outerGroupDetail, i) => (
								<>
									{outerGroupDetail.length > 0 ?

										<Col lg={3} md={4} sm={6} xs={12} style={{
											float: "left",
											fontFamily: "Oswald",
											liststyletype: "none",
											// paddingLeft: "0",
											padding: "0",
											marginRight: "2em",
											marginLeft : "2em",
											// minWidth: "25em",
											minHeight: "16em",
											width: "calc(33% - 1em)",
											// backgroundColor: "#ededed",

										}}>
											<h5 style={{
												fontFamily: "Oswald",
												color: "#fff",
												backgroundColor: "rgb(0 0 0 / 68%)",
												fontWeight: "350",
												fontSize: "1.5em",
												padding: "0.5em 0.75em",
												borderBottom: "0.15em solid #fff",
											}} >{this.state.parentTermLabels[i]}</h5>
											{outerGroupDetail.map((groupDetail, i) => (
												<Accordion style={{
													margin: "0.5em",
												}}>
													<Card >
														<Accordion.Toggle style={{
															fontSize: "1.2em",
															fontFamily: "Oswald",
															padding: "0.5em",
															borderleft: "3px solid #969696",
															color: "#969696",
															backgroundColor: "#fff",
															cursor: "pointer"

														}} className={styles.folderName}
															as={Card.Header} eventKey="0">
															{groupDetail[0].Brand_x0020_Location.Label}
															{/* <i><IoIosArrowForward /></i> */}
															{/* {'      '}{i} */}
														</Accordion.Toggle>
														<Accordion.Collapse eventKey="0">
															<Card.Body className={styles.folderName}>
																<Table style={{
																	fontSize: "0.8em",

																}} responsive>
																	{/* <thead>
																	<th>  Name</th>
																	<th>  Download </th>
																</thead> */}
																	{groupDetail.map((itemDetail, j) => (
																		<tbody
																		>
																			<td><a target='_blank' data-interception="off" rel="noopener noreferrer" style={{
																				display: "inline-block",
																				padding: "1em 0",
																				color: "#616161",
																				cursor: "pointer"

																			}} href={itemDetail.ServerRedirectedEmbedUri}>
																				{/* <Icon style={{
																				overflow: "initial"
																			}}
																				{...getFileTypeIconProps({
																					extension: itemDetail.Title.split(".")[1],
																					size: 20,
																					imageFileType: 'svg'

																				})} /> */}
																				{'      '}{itemDetail.Title}</a></td>
																			<td style={{
																				verticalAlign: "bottom"
																			}}><a
																				data-interception="off" rel="noopener noreferrer" href={"https://devbeam.sharepoint.com/sites/ModernConnect/_layouts/download.aspx?SourceUrl=" + itemDetail.ServerRelativeUrl} download> <IoMdDownload className={styles.downloadBut} /></a></td>
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

							{/* <h5 style={{
							fontFamily: "Oswald",
							color: "#fff",
							backgroundColor: "rgb(0 0 0 / 68%)",
							fontWeight: "350",
							fontSize: "1.5em",
							padding: "0.5em 0.75em",
							borderBottom: "0.15em solid #fff",
							width: "100%"
						}} >View All Documents</h5> */}
							<br></br>





						</Row>
						<Row>
							<div style={{width:"100%"}}>
								<ManageDocModal rackUrl={this.state.hrefString} />

							</div>
						</Row>
					</>




					:
					<div className={styles.container}>
						Loading
						<div className={styles.flip}>
							<div><div>Data</div></div>
							<div><div>Webpart</div></div>
							<div><div>Content</div></div>
						</div>
						Please Wait!
					</div>

					// <h3 style={{
					// 	fontSize: "1.2em",
					// 	fontFamily: "Oswald"
					// }}>Loading Content...</h3>


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
			</Container>
		);
	}
}
