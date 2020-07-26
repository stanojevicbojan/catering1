/* eslint-disable react/display-name */
import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native'
import colors from '../Colors'
import TodoModal from './TodoModal'
import firebase from '../database/firebaseDb';



export default class TodoList extends React.Component {
    state = {
        showListVisible: false
    }

    toggleListModal() {
        this.setState({showListVisible: !this.state.showListVisible})
    }

    render() {
        const list = this.props.list
        const completedCount = list.todos == undefined ? 0 : list.todos.filter(todo => todo.completed).length
        const remainingCount = list.todos == undefined ? 0 : list.todos.length - completedCount
        const image = { uri: "https://firebasestorage.googleapis.com/v0/b/catering-app-25021.appspot.com/o/shopping-list-cover.jpg?alt=media&token=70b94d34-55cb-403f-9b77-061e9a4aac48" };

        return (
            <View>
                
                <Modal
                    animationType="slide" 
                    visible={this.state.showListVisible} 
                    onRequestClose={() => this.toggleListModal()}
                >
                    
                    <TodoModal 
                        list={list} 
                        closeModal={() => this.toggleListModal()}
                        updateList={this.props.updateList} 
                    />
                    
                </Modal>
                
                <TouchableOpacity 
                    style={[styles.listContainer, {backgroundColor: list.color}]}
                    onPress={() => this.toggleListModal()}
                >
                    
                    {this.state.showlistVisible}
                    
                    <Text style={styles.listTitle} numberOfLines={1}>
                        {list.name}
                    </Text>
                    { list.name == 'Shopping list' ? 
                    <View>
                        
                        <View style={{alignItems: 'center'}}>
                            <Text style={styles.count}>Remaining: {completedCount}</Text>
                        </View>
                        <View style={{alignItems: 'center'}}>
                            <Text style={styles.count}>Completed: {remainingCount}</Text>
                        </View>
                        
                    </View> 
                    : 
                    
                    <View>
                        <View style={{alignItems: 'center'}}>
                            <Text style={styles.count}> Request items to be purchased here</Text>
                        </View>
                    </View> }
                    
                </TouchableOpacity>
            </View>
            
        )
    }
}

const styles = StyleSheet.create({
    listContainer: {
        paddingVertical: 32,
        paddingHorizontal: 16,
        borderRadius: 16,
        marginHorizontal: 12,
        alignItems: "center",
        width: 170,
    },
    listTitle: {
        fontSize: 12,
        fontWeight: "700",
        color: colors.white,
        marginBottom: 18,
    },
    count: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.white
    },
    subtitle: {
        fontSize: 12,
        fontWeight: "700",
        color: colors.white
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
      },
})

