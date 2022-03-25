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

export interface IAtlasBrandDocumentViewerConnectWebPartProps {
  description: string;
}

export default class AtlasBrandDocumentViewerConnectWebPart extends BaseClientSideWebPart<IAtlasBrandDocumentViewerConnectWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IAtlasBrandDocumentViewerConnectProps> = React.createElement(
      AtlasBrandDocumentViewerConnect,
      {
        description: this.properties.description,
        context:this.context
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
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
