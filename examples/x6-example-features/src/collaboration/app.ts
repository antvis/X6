/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import type { Graph } from '@antv/x6'
import { getDefaultObjectFromContainer } from '@fluidframework/aqueduct'
import { getTinyliciousContainer } from '@fluidframework/get-tinylicious-container'

import { GraphDataObjectContainerRuntimeFactory } from './containerCode'
import type { IGraphDataObject } from './dataObject'
import { connectGraph } from './view'

// In interacting with the service, we need to be explicit about whether we're creating a new document vs. loading
// an existing one.  We also need to provide the unique ID for the document we are creating or loading from.

// In this app, we'll choose to create a new document when navigating directly to http://localhost:8080.  For the ID,
// we'll choose to use the current timestamp.  We'll also choose to interpret the URL hash as an existing document's
// ID to load from, so the URL for a document load will look something like http://localhost:8080/#1596520748752.
// These policy choices are arbitrary for demo purposes, and can be changed however you'd like.

const createNew = false
// if (location.hash.length === 0) {
//     createNew = true;
//     location.hash = Date.now().toString();
// }
// const documentId = location.hash.substring(1);
// document.title = documentId;

export async function start(graph: Graph): Promise<void> {
  // The getTinyliciousContainer helper function facilitates loading our container code into a Container and
  // connecting to a locally-running test service called Tinylicious.  This will look different when moving to a
  // production service, but ultimately we'll still be getting a reference to a Container object.  The helper
  // function takes the ID of the document we're creating or loading, the container code to load into it, and a
  // flag to specify whether we're creating a new document or loading an existing one.
  const container = await getTinyliciousContainer(
    'test',
    GraphDataObjectContainerRuntimeFactory,
    createNew,
  )

  // In this app, we know our container code provides a default data object that is an IGraphDataObject.
  const graphDataObject: IGraphDataObject =
    await getDefaultObjectFromContainer<IGraphDataObject>(container)

  connectGraph(graphDataObject, graph)

  // Reload the page on any further hash changes, e.g. in case you want to paste in a different document ID.
  // window.addEventListener('hashchange', () => {
  //   location.reload();
  // });
}
