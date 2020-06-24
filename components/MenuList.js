/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native'
import colors from '../Colors'
import MenuModal from './MenuModal'

export default class MenuList extends React.Component {
    state = {
        showListVisible: false,
    }

    toggleListModal() {
        this.setState({showListVisible: !this.state.showListVisible})
    }

    render() {
        const list = this.props.list
    
        const completedCount = list.todos.map((todo,index) => 
            {
                return (
                        <Text key={index}>{'\u25cf'} {todo.title}{"\n"}</Text>
                )
            }
            )

        return (
            <View>
                <Modal
                    animationType="slide" 
                    visible={this.state.showListVisible} 
                    onRequestClose={() => this.toggleListModal()}
                >
                    <MenuModal 
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
                    <View>
                        <View style={{alignItems: 'center'}}>
                            <Text style={styles.count}>{completedCount}</Text>
                           {/* <Text style={styles.subtitle}>Completed</Text> */}
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
            
        )
    }
}

const styles = StyleSheet.create({
    listContainer: {
        paddingVertical: 32,
        paddingHorizontal: 16,
        
        marginHorizontal: 12,
        alignItems: "center",
        width: 250,
        minHeight: 300,
    },
    listTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: colors.white,
        marginBottom: 18,
    },
    count: {
        fontSize: 20,
        fontWeight: "400",
        color: colors.white
    }
})

