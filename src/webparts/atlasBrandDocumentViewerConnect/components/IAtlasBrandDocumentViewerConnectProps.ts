import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IPickerTerms } from "@pnp/spfx-property-controls";

export interface IAtlasBrandDocumentViewerConnectProps {
  description: string;
  context: WebPartContext;
  terms: IPickerTerms;
  people: any;
}
