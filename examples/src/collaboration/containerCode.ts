/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ContainerRuntimeFactoryWithDefaultDataStore } from '@fluidframework/aqueduct'
import { GraphDataObjectInstantiationFactory } from './dataObject'

/**
 * The GraphDataObjectContainerRuntimeFactory is the container code for our scenario.
 *
 * Since we only need to instantiate and retrieve a single dice roller for our scenario, we can use a
 * ContainerRuntimeFactoryWithDefaultDataStore. We provide it with the type of the data object we want to create
 * and retrieve by default, and the registry entry mapping the type to the factory.
 *
 * This container code will create the single default data object on our behalf and make it available on the
 * Container with a URL of "/", so it can be retrieved via container.request("/").
 */
export const GraphDataObjectContainerRuntimeFactory =
  new ContainerRuntimeFactoryWithDefaultDataStore(
    GraphDataObjectInstantiationFactory,
    new Map([GraphDataObjectInstantiationFactory.registryEntry]),
  )
