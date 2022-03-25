import { WebPartContext } from "@microsoft/sp-webpart-base";
import { sp } from '@pnp/sp/presets/all';
import { SPHttpClient, SPHttpClientResponse, SPHttpClientConfiguration } from '@microsoft/sp-http';
import { Session } from "@pnp/sp-taxonomy";
import "@pnp/sp/taxonomy";
import { ITermStoreInfo } from "@pnp/sp/taxonomy";


export class SPService {
    constructor(private context: WebPartContext) {
        sp.setup({
            spfxContext: this.context
        });
    }

    public async getTerms() {

        const childTree = await sp.termStore.groups.getById("b6da94cd-5a33-4632-9ac1-d54248e2755c").sets.getById("18d36606-4e23-4ad9-972c-381931e72457").getAllChildrenAsOrderedTree();
        // console.log(childTree)

        return childTree;
    }

    public async getAllDocs(selectedBrand) {

        // return "abcd"
        try {
            // console.log(selectedBrand)
            let requestUrl = `https://devbeam.sharepoint.com/sites/ModernConnect/_api/web/getfolderbyserverrelativeurl('Brand%20Documents/${selectedBrand}')/files?$expand=ListItemAllFields`

            let requestUrlforFolders = `https://devbeam.sharepoint.com/sites/ModernConnect/_api/web/getfolderbyserverrelativeurl('Brand%20Documents/${selectedBrand}')/folders?$expand=ListItemAllFields`

            let myItems = await (await this.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1)).json();
            let myFolders = await (await this.context.spHttpClient.get(requestUrlforFolders, SPHttpClient.configurations.v1)).json();

            // console.log(myItems.value);
            // console.log(myFolders.value);
            // console.log(requestUrl);
            // console.log(requestUrlforFolders)

            var allItems = myItems.value


            for (var j = 0; j < myFolders.value.length; j++) {
                console.log(myFolders.value[j].ServerRelativeUrl.substring(37))
                let innerFiles = await this.getAllDocs(myFolders.value[j].ServerRelativeUrl.substring(37))
                let ac = [...allItems, ...innerFiles]
                // console.log(ac)

                // console.log(allItems)
                allItems = ac;
                // console.log(innerFiles)
            }

            return allItems;
        }
        catch (err) {

            console.error(err)
        }


    }
}