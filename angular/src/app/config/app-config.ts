import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import * as pathUtils from './path.utils';
import { Field } from '../shared/interfaces/field';

@Injectable()
export class AppConfig {
  private fields: Field[];

  constructor(private readonly http: HttpClient) {}

  /** load application config */
  public load() {
    return this.http.get<Field[]>(pathUtils.GET_FIELD_KEY_VALUE_PATH).subscribe((data) => {
      this.fields = data;
    });
  }

  public getValueByKey(key: string): string {
    return this.fields.find((t) => t.key === key).value;
  }
}
