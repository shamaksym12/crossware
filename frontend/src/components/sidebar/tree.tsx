import React, { useEffect, useState } from "react";
import Container from "components/Container";
import { Tree } from 'antd';
import { useSelector, useDispatch } from "react-redux";
import { setSelectedLocations, getLocations } from "redux/app/actions";
import { getAppState } from "redux/app/selectors";
import { Helmet } from "redux/app/reducer";

const LocationsTree = () => {
    const [treeData, setTreeData] = useState<any>();
    const [checkedKeys, setCheckedKeys] = useState<any>([]);
    const user = JSON.parse(localStorage.getItem('user')!);
    const { locations, token } = useSelector(
      getAppState
    );
    const dispatch = useDispatch();

    const defaultTreeData = [
      {
        id: 1,
        name: <span style={{ fontSize: '16px', fontWeight: '600' }}>テスト</span>,
        title: <span style={{ fontSize: '16px', fontWeight: '600' }}>テスト</span>,
        parentId: null,
        key: 1
      },
      {
        id: 2,
        name: <span style={{ fontSize: '16px', fontWeight: '600' }}>チーム</span>,
        title: <span style={{ fontSize: '16px', fontWeight: '600' }}>チーム</span>,
        parentId: 1,
        key: 2
      }
    ];

    useEffect(() => {
      const hirarchicalTree = flatToHierarchy(defaultTreeData);
      setTreeData(hirarchicalTree);
    }, []);

    useEffect(() => {
      const newTreeData = defaultTreeData;

      locations.map((location: any) => newTreeData.push(location));
      const hirarchicalTree = flatToHierarchy(newTreeData);

      setTreeData(hirarchicalTree);

      let newPositions: Helmet[] = [];

      if (Array.isArray(checkedKeys)) {
        for (let i = 0; i < checkedKeys.length; i++) {
          for (let j = 0; j < locations.length; j++) {
            if (locations[j].key === checkedKeys[i]) {
              newPositions.push(locations[j]);
              break;
            }
          }
        }
      }
      
      dispatch(setSelectedLocations(newPositions));
    }, [locations]);

    const flatToHierarchy = (flat: any) => {
      let roots: any[] = [];
      let all: any = {};
  
      [...flat].forEach(function(item) {
        all[item.id] = { ...item };
      });
  
      Object.keys(all).forEach(function(id) {
        let item = all[id];
        if (item.parentId === null) {
          roots.push(item);
        } else if (item.parentId in all) {
          let p = all[item.parentId];
          if (!("children" in p)) {
            p.children = [];
          }
          p.children.push(item);
        }
      });
  
      return roots;
    };

    const onSelect = (selectedKeys: React.Key[], info: any) => {
        console.log('selected', selectedKeys, info);
    };
    
    const onCheck = (keys: React.Key[] | { checked: React.Key[]; halfChecked: React.Key[]; }, info: any) => {
      dispatch(getLocations(`${user.company_id}`, token));
      setCheckedKeys(keys);
    };

    const onLoadData = ({ key, children }: any) =>
      new Promise<void>(resolve => {
        if (children) {
          resolve();
          return;
        }
        setTimeout(() => {
          resolve();
        }, 1000);
      });

    return (
      <Container className="pin">
        <Tree
          checkable
          defaultExpandedKeys={[1, 2]}
          onSelect={onSelect}
          onCheck={onCheck}
          treeData={treeData}
          loadData={onLoadData}
        />
      </Container>
    );
  };

export default LocationsTree;