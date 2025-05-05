import React, { useEffect, useState } from 'react';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
// Item Component (Draggable but not sortable)
function Item({ id, content }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    padding: '10px',
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginBottom: '8px',
    cursor: 'move',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      {content}
    </div>
  );
}

// SortableItem Component
function SortableItem({ id, content }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '10px',
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginBottom: '8px',
    cursor: 'move',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
        <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
        <DragIndicatorIcon />
        {content}
        </div>

    </div>
  );
}

// Container component for the left column
function DroppableContainer({ id, children }) {
  const { setNodeRef , isOver } = useDroppable({
    id
  });

  return (
    <div ref={setNodeRef} 
        style={
            {
                zIndex: 9999999999, 
                border: isOver ? '2px solid blue': '',  
                padding: isOver ? '10px': '',  
                minHeight: '200px' 
            }
        }
    >
      {children}
    </div>
  );
}

// Main DragDropColumns Component
function DragDropColumns({ totalItems = [], initialRightItems = [], handleSelectedFiltersChange, columnContainingProductIDs }) {
  // Generate IDs for items if they don't have them
  const itemsWithIds = totalItems.filter(item => item != columnContainingProductIDs).map((item, index) => 
    typeof item === 'string' ? { id: `item-${index}`, content: item } : item
  );
  
  const [activeId, setActiveId] = useState(null);
  const [rightItems, setRightItems] = useState(
    initialRightItems.filter(item => item != columnContainingProductIDs).map((item, index) => 
      typeof item === 'string' ? { id: `right-${index}`, content: item } : item
    )
  );

  // Items in left = total - right
  const leftItems = itemsWithIds.filter(
    item => !rightItems.some(rightItem => rightItem.content === item.content)
  );


  useEffect(() => {
    handleSelectedFiltersChange(rightItems.map(item => item.content))
  }, [rightItems])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event) {
    const { active } = event;
    setActiveId(active.id);
    console.log(active)
  }

  function handleDragOver(event) {
    // We could implement additional logic here if needed
  }

  function handleDragEnd(event) {
    const { active, over,  } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    // Check if we're dragging from left to right container
    const isActiveFromLeft = leftItems.some(item => item.id === active.id);
    const isActiveFromRight = rightItems.some(item => item.id === active.id);
    
    // Check if dropping in left or right container
    const isOverInLeft = over.id === 'left-container';
    const isOverInRight = over.id === 'right-container' || rightItems.some(item => item.id === over.id);

    console.log(isOverInLeft, isOverInRight)

    // Handle dropping from left to right
    if (isActiveFromLeft && isOverInRight) {
      const activeItem = leftItems.find(item => item.id === active.id);
      if (activeItem) {
        setRightItems(prev => {
          const overIndex = over.id !== 'right-container' 
            ? prev.findIndex(item => item.id === over.id)
            : prev.length;
          const newItem = { ...activeItem, id: `right-${Date.now()}` };
          const newItems = [...prev];
          newItems.splice(overIndex >= 0 ? overIndex : prev.length, 0, newItem);
          return newItems;
        });
      }
    }
    // Handle dropping from right to left
    else if (isActiveFromRight && isOverInLeft) {
      setRightItems(prev => prev.filter(item => item.id !== active.id));
    }
    // Sort within right container
    else if (isActiveFromRight && isOverInRight && over.id !== 'right-container') {
      setRightItems(prev => {
        const oldIndex = prev.findIndex(item => item.id === active.id);
        const newIndex = prev.findIndex(item => item.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  }

  const activeItem = [...leftItems, ...rightItems].find(item => item.id === activeId);

  const containerStyle = {
    display: 'flex',
    gap: '20px',
    width: '100%',
  };

  const columnStyle = {
    width: '50%',
    padding: '16px',
    borderRadius: '8px',
  };

  const leftColumnStyle = {
    ...columnStyle,
    backgroundColor: '#f3f4f6',
  };

  const rightColumnStyle = {
    ...columnStyle,
    backgroundColor: '#e0f2fe',
  };

  const headerStyle = {
    fontSize: '20px',
    marginTop: 0,
    fontWeight: 'bold',
    textAlign:'center',
    marginBottom: '16px',
  };

  const dragOverlayStyle = {
    padding: '10px',
    backgroundColor: 'white',
    border: '2px solid #3b82f6',
    borderRadius: '4px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div style={containerStyle}>
          {/* Left Column (Not sortable, but draggable) */}
          <div style={leftColumnStyle}>
            <h2 style={headerStyle}>Available Filters</h2>
            <DroppableContainer  id="left-container">
              {leftItems.map(item => (
                <Item 
                  key={item.id} 
                  id={item.id} 
                  content={item.content}
                />
              ))}
            </DroppableContainer>
          </div>
            
            <div style={{display:'flex', alignItems:'center'}}>
                <SyncAltIcon />
            </div>

          {/* Right Column (Sortable) */}
          <div style={rightColumnStyle}>
            <h2 style={headerStyle}>Selected Filters</h2>
            <DroppableContainer id="right-container">
              <SortableContext
                id="right"
                style={{zIndex: -999}}
                items={rightItems.map(item => item.id)}
                strategy={verticalListSortingStrategy}
              >
                <div>
                  {rightItems.map(item => (
                    <SortableItem 
                      key={item.id} 
                      id={item.id} 
                      content={item.content}
                    />
                  ))}
                </div>
              </SortableContext>
            </DroppableContainer>
          </div>
        </div>

        <DragOverlay>
          {activeId ? (
            <div style={{...dragOverlayStyle}}>
              
              <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
        <DragIndicatorIcon />
        {activeItem?.content}
        </div>

            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

// Example usage
function DragAndDrop({allItems,columnContainingProductIDs, initialRightItems, handleSelectedFiltersChange}) {
  // Sample data

  const appStyle = {
  };

  return (
    <div style={appStyle}>
      <DragDropColumns
        columnContainingProductIDs={columnContainingProductIDs}
        totalItems={allItems.filter(item => item!=columnContainingProductIDs)}
        initialRightItems={initialRightItems.filter(item => item != columnContainingProductIDs) }
        handleSelectedFiltersChange={handleSelectedFiltersChange}
      />
    </div>
  );
}

export default DragAndDrop;