import React from 'react';
import './Entity.less';
import { EntityCanvasModel, EntityProperty } from './interface';
import { EntityType } from './constants';
import { BarsOutlined, EllipsisOutlined } from '@ant-design/icons';

interface Props {
  entity: EntityCanvasModel;
}

export default class Entity extends React.PureComponent<Props, {}> {
  render() {
    const { entity } = this.props;
    const getCls = () => {
      if (entity.entityType === EntityType.FACT) {
        return 'fact';
      } else if (entity.entityType === EntityType.DIM) {
        return 'dim';
      } else {
        return 'other';
      }
    };
    return (
      <div className={`entity-container ${getCls()}`}>
        <div className={`content ${getCls()}`}>
          <div className="head">
            <div>
              <BarsOutlined className="type" />
              <span>{entity?.name}</span>
            </div>
            <EllipsisOutlined className="more" />
          </div>
          <div className="body">
            {entity.properties.map((property: EntityProperty) => {
              console.log('11:', property.isPK);
              return (
                <div className="body-item" key={property.propertyId}>
                  <div className="name">
                    {property?.isPK && <span className="pk">PK</span>}
                    {property?.isFK && <span className="fk">FK</span>}
                    {property.name}
                  </div>
                  <div className="type">{property.propertyType}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
