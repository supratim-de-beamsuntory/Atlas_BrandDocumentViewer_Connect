import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
	IPropertyPaneConfiguration,
	PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'AtlasBrandDocumentViewerConnectWebPartStrings';
import AtlasBrandDocumentViewerConnect from './components/AtlasBrandDocumentViewerConnect';
import { IAtlasBrandDocumentViewerConnectProps } from './components/IAtlasBrandDocumentViewerConnectProps';
// import { PrincipalType, PropertyFieldPeoplePicker } from '@pnp/spfx-property-controls';

import { PropertyFieldPeoplePicker, PrincipalType } from '@pnp/spfx-property-controls/lib/PropertyFieldPeoplePicker';
// import { IPropertyFieldGroupOrPerson } from "@pnp/spfx-property-controls/lib/PropertyFieldPeoplePicker";

import PnPTelemetry from "@pnp/telemetry-js";
const telemetry = PnPTelemetry.getInstance();
telemetry.optOut();

export interface IAtlasBrandDocumentViewerConnectWebPartProps {
	description: string;
	// terms: IPickerTerms;
	// people: IPropertyFieldGroupOrPerson[]
	people: any;
}

export default class AtlasBrandDocumentViewerConnectWebPart extends BaseClientSideWebPart<IAtlasBrandDocumentViewerConnectWebPartProps> {

	public render(): void {
		const element: React.ReactElement<IAtlasBrandDocumentViewerConnectProps> = React.createElement(
			AtlasBrandDocumentViewerConnect,
			{
				people: this.properties.people,
				description: this.properties.description,
				context: this.context,
				// terms: this.properties.terms
			}
		);

		ReactDom.render(element, this.domElement);
	}

	protected onDispose(): void {
		ReactDom.unmountComponentAtNode(this.domElement);
	}

	protected get dataVersion(): Version {
		return Version.parse('1.0');
	}

	protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
		return {
			pages: [
				{
					header: {
						description: strings.PropertyPaneDescription
					},
					groups: [
						{
							groupName: strings.BasicGroupName,
							groupFields: [
								PropertyPaneTextField('description', {
									label: strings.DescriptionFieldLabel
								}),
								// PropertyFieldPeoplePicker('people', {
								// 	label: 'People Picker',
								// 	initialData: this.properties.people,
								// 	allowDuplicate: false,
								// 	principalType: [PrincipalType.Users, PrincipalType.SharePoint, PrincipalType.Security],
								// 	onPropertyChange: this.onPropertyPaneFieldChanged,
								// 	context: this.context as any,
								// 	properties: this.properties,
								// 	onGetErrorMessage: null,
								// 	deferredValidationTime: 0,
								// 	key: 'peopleFieldId'
								// }),
								PropertyFieldPeoplePicker('people', {
									label: 'PropertyFieldPeoplePicker',
									initialData: this.properties.people,
									allowDuplicate: false,
									principalType: [PrincipalType.Users, PrincipalType.SharePoint, PrincipalType.Security],
									onPropertyChange: this.onPropertyPaneFieldChanged,
									context: this.context,
									properties: this.properties,
									onGetErrorMessage: null,
									deferredValidationTime: 0,
									key: 'peopleFieldId'
								  })
							]
						}
					]
				}
			]
		};
	}
}
