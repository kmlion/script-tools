import { environment } from '../../environments/environment';

/**
 * List of Endpoints
 */
export class Endpoints {
  private static readonly appScope = '****';
  private static readonly BASE_URI = `${environment.apiRootUrl}/****/v1`;
  private static readonly ROLEMGMT_ROOT_API = `${environment. * * *}/****/v1`;

  private static readonly TEMP_DEV_API = `https://****-****/****/v1`;

  // SHARED PART
  public static USER_IDENTITY_BY_UID(email, pirKey, uid): string {
    return `${Endpoints.BASE_URI}/identities?email=${email}&pir_key=${pirKey}&uid=${uid}`;
  }

  public static USER_INFO_FROM_ROLEMGNT(email, pirKey, uid): string {
    return `${Endpoints.ROLEMGMT_ROOT_API}/accounts?email=${email}&pir_key=${pirKey}&uid=${uid}`;
  }

  public static USER_ROLES(id): string {
    return `${Endpoints.ROLEMGMT_ROOT_API}/accounts/${id}/roles?applicationCode=${Endpoints.appScope}`;
  }

  // END USER PART
  public static USER_ACCOUNT_STATUS(id): string {
    return `${Endpoints.BASE_URI}/identities/${id}/accounts-stats`;
  }

  //  ADMIN PART
  public static ADMIN_ACCOUNT_STATUS(): string {
    return `${Endpoints.BASE_URI}/stats`;
  }

  public static ACCOUNT_LIST({ showOnlyUID = [], uid = '', skip = 0, take = 50, wildcard = false, fields = [], sort = [], stats = [] }) {
    // let params = `&requestor_id=125331`;
    // let params = `&requestor_id=40121`;
    let params = `&requestor_id=25276`;
    params += uid ? `&uid=${uid}${wildcard ? '*' : ''}` : '';
    params += skip ? `&start=${skip}` : '';
    params += fields.length ? `&fields=${fields.filter((f) => f).join(',')}` : '';
    params += sort.length ? `&sort=${sort.join(',')}` : '';
    params += stats.length ? `&stats=${stats.join(',')}` : '';
    return `${Endpoints.TEMP_DEV_API}/accounts${params.length > 0 ? `?${params.substring(1, params.length)}` : ''}`;
  }

  public static ACCOUNT_BY_ID(id) {
    return `${Endpoints.TEMP_DEV_API}/accounts/${id}`;
  }

  public static ACCOUNT_AUTO_SUGGEST(term) {
    return this.ACCOUNT_LIST({ uid: term, wildcard: true, fields: ['id,uid,directory'] });
  }

  public static ENVIRONMENT(): string {
    return `${Endpoints.BASE_URI}/environments`;
  }

}
