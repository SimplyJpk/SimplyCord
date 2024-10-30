import { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store/store';
import { useNavigate, useParams } from 'react-router-dom';
// MUI
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
// MUI Components
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
// Slice
import { selectUserServers, updateServerOrder } from '../../../slices/userSlice';
// Resources
import DefaultAvatar from '../../../assets/icons/profile.png';
import PlusCircle from '../../../assets/icons/ui/iconmonstr-plus-circle-lined-240.png';
// Components
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const useStyles = makeStyles((theme: Theme) => ({
  serverListContainer: {
    minWidth: '4.5rem',
    height: '100vh',
    backgroundColor: 'gray.900',
    color: 'white',
    position: 'relative',
    borderRight: `1px solid ${theme.palette.grey[700]}`,
    overflow: 'hidden',
    transition: 'width 0.5s',
  },
  serverList: {
    display: 'flex',
    paddingTop: theme.spacing(1),
    flexDirection: 'column',
    gap: '0.5rem',
    overflowY: 'auto',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  exploreButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '1rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    fontSize: '0.875rem',
    height: '3.5rem',
    width: '3.5rem',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.grey[800],
    },
    position: 'absolute',
    bottom: '0.5rem',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  serverItem: {
    marginLeft: 'auto',
    marginRight: 'auto',
    gap: '0.5rem',
    borderRadius: '0.375rem',
    border: '1px solid',
    backgroundColor: 'white',
    fontSize: '0.875rem',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'gray.200',
    },
    position: 'relative',
    overflow: 'hidden',
  },
  avatar: {
    width: '3.5rem',
    height: '3.5rem',
    backgroundColor: 'gray.50',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'gray.600',
    },
  },
}));

export default function ServerList({ onServerSelect }) {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const servers = useSelector(selectUserServers);
  const [items, setItems] = useState(servers);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        // Do nothing if the new index is the same as the old index
        if (oldIndex === newIndex) {
          return items;
        }

        const newOrder = arrayMove(items, oldIndex, newIndex);
        const newOrderIds = newOrder.map((server) => server.id);
        dispatch(updateServerOrder(newOrderIds));
        return newOrder;
      });
    }
  };

  useEffect(() => {
    setItems(servers);
  }, [servers]);

  return (
    <Box className={classes.serverListContainer}>
      <Box className={classes.serverList}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items}
            strategy={verticalListSortingStrategy}
          >
            {items.map((server) => (
              <SortableItem key={server.id} server={server} onServerSelect={onServerSelect} />
            ))}
          </SortableContext>
        </DndContext>
        <Box
          className={classes.exploreButton}
          onClick={() => navigate('/explore')}
        >
          {/* ... */}
        </Box>
      </Box>
    </Box>
  );
}

// Helper function to reorder array
function arrayMove(array, from, to) {
  const newArray = array.slice();
  newArray.splice(to < 0 ? newArray.length + to : to, 0, newArray.splice(from, 1)[0]);
  return newArray;
}

function SortableItem({ server, onServerSelect }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: server.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const classes = useStyles();

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onServerSelect(server)}
      className={classes.serverItem}
    >
      <Avatar
        src={server.server?.iconUrl || DefaultAvatar}
        alt="avatar"
        className={classes.avatar}
      />
      <Typography
        sx={{
          color: 'black',
          position: 'absolute',
        }}
      >
        {server.server?.name}
      </Typography>
    </Box>
  );
}