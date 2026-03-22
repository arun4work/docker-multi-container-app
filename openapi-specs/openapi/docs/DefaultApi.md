# DefaultApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiValuesAllGet**](#apivaluesallget) | **GET** /api/values/all | Get all values from Postgres|
|[**apiValuesCurrentGet**](#apivaluescurrentget) | **GET** /api/values/current | Get current values from Redis|
|[**apiValuesPost**](#apivaluespost) | **POST** /api/values | Submit a new index|
|[**rootGet**](#rootget) | **GET** / | Health check|

# **apiValuesAllGet**
> Array<ApiValuesAllGet200ResponseInner> apiValuesAllGet()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.apiValuesAllGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<ApiValuesAllGet200ResponseInner>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of values from the database |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiValuesCurrentGet**
> { [key: string]: string; } apiValuesCurrentGet()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.apiValuesCurrentGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**{ [key: string]: string; }**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A map of indices and their calculated values |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiValuesPost**
> ApiValuesPost200Response apiValuesPost(apiValuesPostRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    ApiValuesPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let apiValuesPostRequest: ApiValuesPostRequest; //

const { status, data } = await apiInstance.apiValuesPost(
    apiValuesPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiValuesPostRequest** | **ApiValuesPostRequest**|  | |


### Return type

**ApiValuesPost200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json, text/plain


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful submission |  -  |
|**422** | Index too high |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **rootGet**
> string rootGet()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.rootGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**string**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Returns a greeting |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

