/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const _ = require('lodash');

let registry = {};
function register(type) {
  registry[type.name] = type;
}
function lookup(name) {
  return registry[name];
}

function fromJSON(json, Ctor) {
  const type = typeof json;
  if (json === null || type === 'boolean' || type === 'string' ||
      type === 'function' || type === 'number')
  return json;

  if (Array.isArray(json)) {
    return json.map(datum => fromJSON(datum, Ctor));
  } else if (json.type_) {
    const TypedCtor = lookup(json.type_) || Ctor;
    const values = fromJSON(_.omit(json, ['type_']), Ctor);
    return TypedCtor.fromJSON(values);
  } else {
    return _.mapValues(json, value => fromJSON(value, Ctor));
  }
}

function toJSON(o) {
  const type = typeof o;
  if (o === null || type === 'boolean' || type === 'string' ||
      type === 'function' || type === 'number')
    return o;

  if (o.toJSON) return o.toJSON();

  const Ctor = o.constructor;
  let json = Ctor && Ctor.jsonKeys ? _.pick(o, Ctor.jsonKeys) : o;
  json = _.mapValues(json, value => toJSON(value));

  return Object.assign({type_: Ctor.name}, json);
}

class Base {
  static fromJSON(json) {
    const Ctor = this;
    let ret = new Ctor();
    ret.init(json);
    return ret;
  }

  constructor(opts) {
    this.init(opts || {});
  }

  init(opts) {
    Object.assign(this, opts);
  }

  toJSON() {
    const Ctor = this.constructor;
    let json = Ctor && Ctor.jsonKeys ? _.pick(this, Ctor.jsonKeys) : this;
    json = _.mapValues(
        json,
        value => toJSON(value)
    );

    return Object.assign({type_: Ctor.name}, json);
  }
}

class Callback extends Base {
  static get name() { return 'Callback'; }
}
register(Callback);

class Exception extends Base {
  static get name() { return 'Exception'; }
}
register(Exception);

class Interface extends Base {
  static get name() { return 'Interface'; }
}
register(Interface);

class Namespace extends Base {
  static get name() { return 'Namespace'; }
}
register(Namespace);

class PartialInterface extends Base {
  static get name() { return 'PartialInterface'; }
}
register(PartialInterface);

class Dictionary extends Base {
  static get name() { return 'Dictionary'; }
}
register(Dictionary);

class Enum extends Base {
  static get name() { return 'Enum'; }
}
register(Enum);

class Typedef extends Base {
  static get name() { return 'Typedef'; }
}
register(Typedef);

class Implements extends Base {
  static get name() { return 'Implements'; }
}
register(Implements);

class Serializer extends Base {
  static get name() { return 'Serializer'; }
}
register(Serializer);

class Stringifier extends Base {
  static get name() { return 'Stringifier'; }
}
register(Stringifier);

class Iterable extends Base {
  static get name() { return 'Iterable'; }
}
register(Iterable);

class Attribute extends Base {
  static get name() { return 'Attribute'; }
}
register(Attribute);

class MapLike extends Base {
  static get name() { return 'MapLike'; }
}
register(MapLike);

class SetLike extends Base {
  static get name() { return 'SetLike'; }
}
register(SetLike);

class UnionType extends Base {
  static get name() { return 'UnionType'; }
}
register(UnionType);

class ExtendedAttribute extends Base {
  static get name() { return 'ExtendedAttribute'; }
}
register(ExtendedAttribute);

module.exports = {
  Callback,
  Exception,
  Interface,
  Namespace,
  PartialInterface,
  Dictionary,
  Enum,
  Typedef,
  Implements,
  Serializer,
  Stringifier,
  Iterable,
  Attribute,
  MapLike,
  SetLike,
  UnionType,
  ExtendedAttribute,
};